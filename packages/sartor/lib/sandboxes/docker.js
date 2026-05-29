
import { existsSync } from 'fs';
import { basename, dirname, join } from 'path';
import { spawn } from 'child_process';

const findProjectRoot = (dir) => {
    while (true) {
        if (existsSync(join(dir, '.sartor'))) return dir;
        const parent = dirname(dir);
        if (parent === dir) return undefined;
        dir = parent;
    }
};

const dockerEnv = { ...process.env, DOCKER_CLI_HINTS: 'false' };

const exec = (command, args) => new Promise((resolve, reject) => {
    const proc = spawn(command, args, { env: dockerEnv });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', data => { stdout += data; });
    proc.stderr.on('data', data => { stderr += data; });
    proc.on('close', exitCode => resolve({ exitCode, stdout, stderr }));
    proc.on('error', reject);
});

export default {
    _exec: exec,

    meta(){
        this.annotate({
            description: 'Docker sandbox provider.'
        });
    },

    async _resolveSettings(){
        const config = await this.config;
        const projectRoot = findProjectRoot(process.cwd());
        const projectSlug = basename(projectRoot);
        const name = config.sandbox?.name ?? `sartor-${projectSlug}-sandbox`;
        const tag = name;
        return { projectRoot, name, tag, config };
    },

    async isRunning(){
        const { name } = await this._resolveSettings();
        const result = await exec('docker', ['inspect', '-f', '{{.State.Running}}', name]);
        return result.stdout.trim() === 'true';
    },

    async start(){
        const { projectRoot, name, tag } = await this._resolveSettings();

        const imageCheck = await this._exec('docker', ['image', 'inspect', tag]);
        if (imageCheck.exitCode !== 0) {
            const build = await this.spinner.run(
                'Building sandbox image',
                () => this._exec('docker', [
                    'build', '-f', join(projectRoot, '.sartor', 'Dockerfile.sandbox'),
                    '-t', tag, join(projectRoot, '.sartor')
                ]),
                { success: 'Built sandbox image' }
            );
            if (build.exitCode !== 0) throw new Error(`docker build failed: ${build.stderr}`);
        }

        const inspect = await this._exec('docker', ['inspect', '-f', '{{.State.Running}}', name]);
        if (inspect.exitCode === 0) {
            if (inspect.stdout.trim() === 'true') return;
            await this._exec('docker', ['start', name]);
            return;
        }

        await this.spinner.run('Creating sandbox container', async () => {
            const run = await this._exec('docker', [
                'run', '-d', '--name', name, '-v', `${projectRoot}:/app`, tag
            ]);
            if (run.exitCode !== 0) {
                if (run.stderr.includes('name already in use')) {
                    while (true) {
                        const check = await this._exec('docker', ['inspect', '-f', '{{.State.Running}}', name]);
                        if (check.stdout.trim() === 'true') return;
                        await new Promise(r => setTimeout(r, 500));
                    }
                }
                throw new Error(`docker run failed: ${run.stderr}`);
            }
        }, { success: 'Created sandbox container' });
    },

    async stop(){
        const { name } = await this._resolveSettings();
        await exec('docker', ['stop', name]);
    },

    async remove(){
        const { name } = await this._resolveSettings();
        await exec('docker', ['rm', '-f', name]);
    },

    async run(command, opts = {}){
        if (!(await this.isRunning())) await this.start();

        const { name, config } = await this._resolveSettings();
        const env = { SARTOR_IN_SANDBOX: '1', ...(config.sandbox?.env ?? {}), ...opts.env };
        const args = ['exec'];
        if (opts.interactive) args.push('-it');
        const cwd = opts.cwd ?? '/app';
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
