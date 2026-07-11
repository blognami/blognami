
import { existsSync, readFileSync, readdirSync } from 'fs';
import { basename, join } from 'path';
import { spawn } from 'child_process';

import { WORKTREES_DIR } from '../services/git.js';

// Minimal npm-workspace pattern expansion (segments with `*` wildcards, e.g.
// `packages/*`) — fs.globSync would cover this but is experimental and warns.
const expandWorkspacePattern = (projectRoot, pattern) => {
    let paths = ['.'];
    for(const segment of pattern.split('/').filter(segment => segment && segment !== '.')){
        if(segment.includes('*')){
            const matcher = new RegExp(`^${segment.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`);
            paths = paths.flatMap(path => {
                const dir = join(projectRoot, path);
                if(!existsSync(dir)) return [];
                return readdirSync(dir)
                    .filter(name => matcher.test(name))
                    .map(name => path === '.' ? name : `${path}/${name}`);
            });
        } else {
            paths = paths.map(path => path === '.' ? segment : `${path}/${segment}`);
        }
    }
    return paths;
};

// DOCKER_BUILDKIT is the default since Docker 23 — forced here because the
// generated Dockerfile relies on BuildKit heredocs.
const dockerEnv = { ...process.env, DOCKER_CLI_HINTS: 'false', DOCKER_BUILDKIT: '1' };

const exec = (command, args, { input } = {}) => new Promise((resolve, reject) => {
    const proc = spawn(command, args, { env: dockerEnv });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', data => { stdout += data; });
    proc.stderr.on('data', data => { stderr += data; });
    proc.on('close', exitCode => resolve({ exitCode, stdout, stderr }));
    proc.on('error', reject);
    if (input !== undefined) proc.stdin.write(input);
    proc.stdin.end();
});

export default {
    exec,

    meta(){
        this.annotate({
            description: 'Docker sandbox provider.'
        });
    },

    async resolveSettings(){
        const config = await this.config;
        const project = await this.project;
        const projectRoot = project.rootPath;
        const projectSlug = basename(projectRoot);
        const baseName = config.sandbox?.name ?? `kraal-${projectSlug}-sandbox`;
        const branch = this.params.branch;
        const isBranch = Boolean(branch) && branch !== await this.git.branch;
        const name = isBranch ? `${baseName}--${branch.replace(/[^a-zA-Z0-9_.-]/g, '-')}` : baseName;
        const tag = baseName;
        const worktreePath = isBranch ? `${WORKTREES_DIR}/${branch}` : null;
        const workDir = isBranch ? `/app/${worktreePath}` : '/app';
        const volumes = isBranch
            ? [
                ...this.resolveVolumes(projectRoot, name),
                ...this.resolveVolumes(join(projectRoot, worktreePath), name, worktreePath)
            ]
            : this.resolveVolumes(projectRoot, name);
        return { projectRoot, name, tag, config, volumes, isBranch, worktreePath, workDir };
    },

    // Shadow every node_modules the container's npm can write to with a named
    // volume — otherwise Linux binaries land on the host through the bind mount.
    resolveVolumes(projectRoot, name, prefix = ''){
        const paths = ['node_modules'];
        const packageJsonPath = join(projectRoot, 'package.json');
        if(existsSync(packageJsonPath)){
            let workspaces;
            try {
                workspaces = JSON.parse(readFileSync(packageJsonPath, 'utf8')).workspaces;
            } catch {}
            for(const pattern of Array.isArray(workspaces) ? workspaces : []){
                for(const match of expandWorkspacePattern(projectRoot, pattern)){
                    if(!existsSync(join(projectRoot, match, 'package.json'))) continue;
                    const path = `${match}/node_modules`;
                    if(!paths.includes(path)) paths.push(path);
                }
            }
        }
        return paths.map(path => {
            const fullPath = prefix ? `${prefix}/${path}` : path;
            return {
                path: fullPath,
                volume: `${name}-${fullPath.replace(/[^a-zA-Z0-9_.-]/g, '-')}`
            };
        });
    },

    // The sandbox image definition, generated in memory and piped to
    // `docker build` on stdin — there is no build context, so context-relative
    // COPY would fail; the install script is embedded via a BuildKit heredoc.
    buildDockerfile(install){
        const lines = [
            'FROM node:22-bookworm',
            '',
            '# Create non-root user for running sandboxed commands',
            'RUN useradd -m -s /bin/bash kraal',
            '',
            'WORKDIR /app',
            '',
            '# Pre-create node_modules owned by kraal so the named volume inherits ownership',
            'RUN mkdir -p node_modules && chown kraal:kraal node_modules'
        ];
        if (install?.trim()) {
            // Quoted heredoc — no Dockerfile-side variable expansion; grow the
            // terminator until no line of the script collides with it.
            let terminator = 'KRAAL_INSTALL';
            while (new RegExp(`^${terminator}$`, 'm').test(install)) terminator += '_';
            lines.push(
                '',
                '# Project-specific setup from the config\'s sandbox.install script',
                `COPY <<'${terminator}' /tmp/install.sh`,
                install.replace(/\n$/, ''),
                terminator,
                'RUN sh -e /tmp/install.sh && rm /tmp/install.sh'
            );
        }
        lines.push(
            '',
            'USER kraal',
            '',
            'RUN git config --global user.name "Kraal (Docker)" && \\',
            '    git config --global user.email "kraal@localhost"',
            '',
            'CMD ["sh", "-c", "cd ${KRAAL_APP_DIR:-/app} && if [ -f package.json ] && [ ! -f node_modules/.package-lock.json ]; then npm ci || npm install; fi && tail -f /dev/null"]'
        );
        return lines.join('\n') + '\n';
    },

    async isRunning(){
        const { name } = await this.resolveSettings();
        const result = await this.exec('docker', ['inspect', '-f', '{{.State.Running}}', name]);
        return result.stdout.trim() === 'true';
    },

    async start(){
        // Must precede resolveSettings so worktree volume resolution can see
        // the worktree's package.json.
        await this.git.ensureWorktree(this.params.branch);
        const { projectRoot, name, tag, config, volumes, isBranch, worktreePath, workDir } = await this.resolveSettings();

        // Always build — Docker's layer cache makes this a fast no-op unless
        // the generated Dockerfile (e.g. the config's install script) changed
        // since the last build.
        const build = await this.spinner.run(
            'Building sandbox image',
            () => this.exec('docker', ['build', '-t', tag, '-'], {
                input: this.buildDockerfile(config.sandbox?.install)
            }),
            { success: 'Built sandbox image' }
        );
        if (build.exitCode !== 0) throw new Error(`docker build failed: ${build.stderr}`);

        const imageId = (await this.exec('docker', ['image', 'inspect', '-f', '{{.Id}}', tag])).stdout.trim();

        const inspect = await this.exec('docker', ['container', 'inspect', '-f', '{{.State.Running}} {{.Image}}', name]);
        if (inspect.exitCode === 0) {
            const [running, containerImageId] = inspect.stdout.trim().split(' ');
            if (containerImageId === imageId) {
                if (running === 'true') return;
                await this.exec('docker', ['start', name]);
                return;
            }
            // The container predates the freshly built image — recreate it
            // (named volumes survive, so node_modules carry over).
            await this.exec('docker', ['rm', '-f', name]);
        }

        await this.spinner.run('Creating sandbox container', async () => {
            // Fresh named volumes are root-owned; chown them so the container's
            // non-root user can npm install into them.
            if (volumes.length) {
                const initArgs = ['run', '--rm', '-u', 'root'];
                volumes.forEach(({ volume }, index) => initArgs.push('-v', `${volume}:/kraal-volumes/${index}`));
                initArgs.push(tag, 'sh', '-c', 'chown kraal:kraal /kraal-volumes/*');
                const init = await this.exec('docker', initArgs);
                if (init.exitCode !== 0) throw new Error(`docker volume init failed: ${init.stderr}`);
            }

            const runArgs = ['run', '-d', '--name', name, '-v', `${projectRoot}:/app`];
            // The worktree lives under node_modules, which the named volume
            // below shadows — bind it back in on top (docker layers nested
            // mounts by target depth, so argv order doesn't matter).
            if (isBranch) runArgs.push('-v', `${join(projectRoot, worktreePath)}:/app/${worktreePath}`);
            for (const { path, volume } of volumes) runArgs.push('-v', `${volume}:/app/${path}`);
            // Points the image's first-boot npm install at the worktree.
            if (isBranch) runArgs.push('-e', `KRAAL_APP_DIR=${workDir}`);
            // Bake config env into the container so the CMD sees it too (e.g. a
            // playwright postinstall during the startup npm ci); exec-time -e
            // flags still override per run.
            for (const [key, value] of Object.entries(config?.sandbox?.env ?? {})) {
                if (value === undefined) continue;
                runArgs.push('-e', `${key}=${value}`);
            }
            runArgs.push(tag);
            const run = await this.exec('docker', runArgs);
            if (run.exitCode !== 0) {
                if (run.stderr.includes('name already in use')) {
                    while (true) {
                        const check = await this.exec('docker', ['inspect', '-f', '{{.State.Running}}', name]);
                        if (check.stdout.trim() === 'true') return;
                        await new Promise(r => setTimeout(r, 500));
                    }
                }
                throw new Error(`docker run failed: ${run.stderr}`);
            }
        }, { success: 'Created sandbox container' });
    },

    async stop(){
        const { name } = await this.resolveSettings();
        await this.exec('docker', ['stop', name]);
    },

    async remove(){
        const { name, volumes } = await this.resolveSettings();
        await this.exec('docker', ['rm', '-f', name]);
        if (volumes.length) {
            await this.exec('docker', ['volume', 'rm', '-f', ...volumes.map(({ volume }) => volume)]);
        }
        // Container first so its bind mount is released; the branch itself is
        // kept, only the worktree checkout goes.
        await this.git.removeWorktree(this.params.branch);
    },

    // Assembles the `docker exec` argv, including the env injected into the
    // container. Split out from run() so it can be unit-tested without spawning.
    async resolveExecArgs(command, opts){
        const { name, config, workDir } = await this.resolveSettings();

        // Override the container's baked-in git identity with the host's, so
        // commits made in the sandbox are authored as the host user. These env
        // vars take precedence over in-container git config.
        const identity = await this.git.identity;
        const gitEnv = {};
        if (identity.name) { gitEnv.GIT_AUTHOR_NAME = identity.name; gitEnv.GIT_COMMITTER_NAME = identity.name; }
        if (identity.email) { gitEnv.GIT_AUTHOR_EMAIL = identity.email; gitEnv.GIT_COMMITTER_EMAIL = identity.email; }

        const env = { KRAAL_IN_SANDBOX: '1', ...gitEnv, ...(config.sandbox?.env ?? {}), ...opts.env };
        const args = ['exec'];
        if (opts.interactive) args.push('-it');
        const cwd = opts.cwd ?? workDir;
        args.push('-w', cwd);
        for (const [key, value] of Object.entries(env)) {
            if (value === undefined) continue;
            args.push('-e', `${key}=${value}`);
        }
        if (Array.isArray(command)) {
            args.push(name, ...command);
        } else {
            args.push(name, 'sh', '-c', command);
        }
        return args;
    },

    async run(command, opts = {}){
        if (!(await this.isRunning())) await this.start();

        const args = await this.resolveExecArgs(command, opts);

        if (opts.interactive) {
            return new Promise((resolve, reject) => {
                const proc = spawn('docker', args, { stdio: 'inherit', env: dockerEnv });
                proc.on('close', exitCode => resolve({ exitCode }));
                proc.on('error', reject);
            });
        }

        return new Promise((resolve, reject) => {
            const proc = spawn('docker', args, { env: dockerEnv });
            let stdout = '';
            let stderr = '';
            let stdoutRemainder = '';
            let stderrRemainder = '';

            proc.stdout.on('data', data => {
                const str = data.toString();
                stdout += str;
                if (typeof opts.onStdout === 'function') {
                    const parts = (stdoutRemainder + str).split('\n');
                    stdoutRemainder = parts.pop();
                    for (const line of parts) opts.onStdout(line);
                }
            });

            proc.stderr.on('data', data => {
                const str = data.toString();
                stderr += str;
                if (typeof opts.onStderr === 'function') {
                    const parts = (stderrRemainder + str).split('\n');
                    stderrRemainder = parts.pop();
                    for (const line of parts) opts.onStderr(line);
                }
            });

            proc.on('close', exitCode => resolve({ exitCode, stdout, stderr }));
            proc.on('error', reject);
        });
    }
};
