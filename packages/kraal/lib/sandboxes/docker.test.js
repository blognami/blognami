
import { describe, it, beforeEach, after } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import docker from './docker.js';

const ok = (stdout = '') => ({ exitCode: 0, stdout, stderr: '' });
const fail = (stderr = '') => ({ exitCode: 1, stdout: '', stderr });

describe('docker sandbox – spinner integration', () => {
    let instance;
    let spinnerCalls;
    let execLog;
    let execInputs;

    beforeEach(() => {
        spinnerCalls = [];
        execLog = [];
        execInputs = [];

        instance = Object.create(docker);
        instance.params = {};
        instance.resolveSettings = async () => ({
            projectRoot: '/fake',
            name: 'test-sandbox',
            tag: 'test-sandbox',
            config: {},
            volumes: [],
        });
        instance.spinner = {
            run: async (label, fn, opts) => {
                spinnerCalls.push({ label, opts });
                return fn();
            },
        };
    });

    function stubExec(...responses) {
        let idx = 0;
        instance.exec = async (cmd, args, opts) => {
            execLog.push([cmd, ...args]);
            execInputs.push(opts?.input);
            return responses[idx++];
        };
    }

    it('always runs the build under the spinner and skips container work when nothing changed', async () => {
        stubExec(
            ok(),                    // docker build → success (inside spinner)
            ok('sha256:img'),        // docker image inspect → built image id
            ok('true sha256:img'),   // docker container inspect → running, same image
        );

        await instance.start();

        assert.strictEqual(spinnerCalls.length, 1);
        assert.strictEqual(spinnerCalls[0].label, 'Building sandbox image');
        assert.deepStrictEqual(spinnerCalls[0].opts, { success: 'Built sandbox image' });
        assert.strictEqual(execLog.length, 3);
    });

    it('builds from a stdin Dockerfile with no build context', async () => {
        stubExec(
            ok(),                    // docker build → success (inside spinner)
            ok('sha256:img'),        // docker image inspect → built image id
            ok('true sha256:img'),   // docker container inspect → running, same image
        );

        await instance.start();

        assert.deepStrictEqual(execLog[0], ['docker', 'build', '-t', 'test-sandbox', '-']);
        assert.match(execInputs[0], /^FROM node:22-bookworm\n/);
    });

    it('embeds config.sandbox.install in the Dockerfile piped to the build', async () => {
        instance.resolveSettings = async () => ({
            projectRoot: '/fake',
            name: 'test-sandbox',
            tag: 'test-sandbox',
            config: { sandbox: { install: 'apt-get install -y sqlite3' } },
            volumes: [],
        });
        stubExec(
            ok(),                    // docker build → success (inside spinner)
            ok('sha256:img'),        // docker image inspect → built image id
            ok('true sha256:img'),   // docker container inspect → running, same image
        );

        await instance.start();

        assert.match(execInputs[0], /apt-get install -y sqlite3/);
    });

    it('throws when the build fails', async () => {
        stubExec(
            fail('boom'),            // docker build → failure (inside spinner)
        );

        await assert.rejects(() => instance.start(), /docker build failed: boom/);
    });

    it('starts a stopped container when the image is unchanged', async () => {
        stubExec(
            ok(),                    // docker build → success (inside spinner)
            ok('sha256:img'),        // docker image inspect → built image id
            ok('false sha256:img'),  // docker container inspect → stopped, same image
            ok(),                    // docker start
        );

        await instance.start();

        assert.deepStrictEqual(execLog[3], ['docker', 'start', 'test-sandbox']);
    });

    it('recreates the container when a rebuild produced a new image', async () => {
        stubExec(
            ok(),                    // docker build → success (inside spinner)
            ok('sha256:new'),        // docker image inspect → freshly built id
            ok('true sha256:old'),   // docker container inspect → running on the old image
            ok(),                    // docker rm -f
            ok(),                    // docker run -d … (inside spinner)
        );

        await instance.start();

        assert.deepStrictEqual(execLog[3], ['docker', 'rm', '-f', 'test-sandbox']);
        assert.strictEqual(spinnerCalls[1].label, 'Creating sandbox container');
        assert.deepStrictEqual(execLog[4].slice(0, 5), ['docker', 'run', '-d', '--name', 'test-sandbox']);
    });

    it('calls spinner with "Creating sandbox container" when the container is missing', async () => {
        stubExec(
            ok(),                    // docker build → success (inside spinner)
            ok('sha256:img'),        // docker image inspect → built image id
            fail(),                  // docker container inspect → not found
            ok(),                    // docker run → success (inside spinner)
        );

        await instance.start();

        assert.strictEqual(spinnerCalls.length, 2);
        assert.strictEqual(spinnerCalls[1].label, 'Creating sandbox container');
        assert.deepStrictEqual(spinnerCalls[1].opts, { success: 'Created sandbox container' });
    });

    it('race-handling poll runs inside spinner when docker run returns "name already in use"', async () => {
        stubExec(
            ok(),                                        // docker build → success (inside spinner)
            ok('sha256:img'),                            // docker image inspect → built image id
            fail(),                                      // docker container inspect → not found
            fail('name already in use'),                 // docker run → race conflict (inside spinner)
            ok('false'),                                 // poll inspect → not ready yet
            ok('true'),                                  // poll inspect → running
        );

        await instance.start();

        assert.strictEqual(spinnerCalls.length, 2);
        assert.strictEqual(spinnerCalls[1].label, 'Creating sandbox container');
        const inspectPolls = execLog.filter(
            c => c[0] === 'docker' && c[1] === 'inspect' && c.includes('test-sandbox')
        );
        assert.ok(inspectPolls.length >= 2, 'expected at least 2 inspect polls during race handling');
    });

    it('chowns named volumes via a root init run before mounting them into the container', async () => {
        instance.resolveSettings = async () => ({
            projectRoot: '/fake',
            name: 'test-sandbox',
            tag: 'test-sandbox',
            config: {},
            volumes: [
                { path: 'node_modules', volume: 'test-sandbox-node_modules' },
                { path: 'packages/@blognami/posts/node_modules', volume: 'test-sandbox-packages--blognami-posts-node_modules' },
            ],
        });
        stubExec(
            ok(),                    // docker build → success (inside spinner)
            ok('sha256:img'),        // docker image inspect → built image id
            fail(),                  // docker container inspect → not found
            ok(),                    // docker run --rm -u root … chown (init)
            ok(),                    // docker run -d … (main)
        );

        await instance.start();

        const initRun = execLog[3];
        assert.deepStrictEqual(initRun, [
            'docker', 'run', '--rm', '-u', 'root',
            '-v', 'test-sandbox-node_modules:/kraal-volumes/0',
            '-v', 'test-sandbox-packages--blognami-posts-node_modules:/kraal-volumes/1',
            'test-sandbox', 'sh', '-c', 'chown kraal:kraal /kraal-volumes/*',
        ]);

        const mainRun = execLog[4];
        assert.deepStrictEqual(mainRun, [
            'docker', 'run', '-d', '--name', 'test-sandbox',
            '-v', '/fake:/app',
            '-v', 'test-sandbox-node_modules:/app/node_modules',
            '-v', 'test-sandbox-packages--blognami-posts-node_modules:/app/packages/@blognami/posts/node_modules',
            'test-sandbox',
        ]);
    });

    it('passes config.sandbox.env as -e flags at container creation, filtering undefined values', async () => {
        instance.resolveSettings = async () => ({
            projectRoot: '/fake',
            name: 'test-sandbox',
            tag: 'test-sandbox',
            config: { sandbox: { env: { PLAYWRIGHT_BROWSERS_PATH: '/opt/playwright-browsers', MISSING: undefined } } },
            volumes: [],
        });
        stubExec(
            ok(),                    // docker build → success (inside spinner)
            ok('sha256:img'),        // docker image inspect → built image id
            fail(),                  // docker container inspect → not found
            ok(),                    // docker run -d … (main)
        );

        await instance.start();

        assert.deepStrictEqual(execLog[3], [
            'docker', 'run', '-d', '--name', 'test-sandbox',
            '-v', '/fake:/app',
            '-e', 'PLAYWRIGHT_BROWSERS_PATH=/opt/playwright-browsers',
            'test-sandbox',
        ]);
    });

    it('mounts the common git dir at its host-absolute path for worktree containers', async () => {
        instance.resolveSettings = async () => ({
            projectRoot: '/fake',
            name: 'test-sandbox--foo',
            tag: 'test-sandbox',
            config: {},
            volumes: [],
            commonDir: '/host/repo/.git',
        });
        stubExec(
            ok(),                    // docker build → success (inside spinner)
            ok('sha256:img'),        // docker image inspect → built image id
            fail(),                  // docker container inspect → not found
            ok(),                    // docker run -d … (main)
        );

        await instance.start();

        assert.deepStrictEqual(execLog[0], ['docker', 'build', '-t', 'test-sandbox', '-'], 'image tag stays the base name');
        assert.deepStrictEqual(execLog[3], [
            'docker', 'run', '-d', '--name', 'test-sandbox--foo',
            '-v', '/fake:/app',
            '-v', '/host/repo/.git:/host/repo/.git',
            'test-sandbox',
        ]);
        assert.ok(!execLog[3].some(arg => arg.includes('KRAAL_APP_DIR')));
    });

    it('remove() removes the container then its named volumes', async () => {
        instance.resolveSettings = async () => ({
            projectRoot: '/fake',
            name: 'test-sandbox',
            tag: 'test-sandbox',
            volumes: [
                { path: 'node_modules', volume: 'test-sandbox-node_modules' },
                { path: 'packages/a/node_modules', volume: 'test-sandbox-packages-a-node_modules' },
            ],
        });
        stubExec(
            ok(),             // docker rm -f
            ok(),             // docker volume rm -f
        );

        await instance.remove();

        assert.deepStrictEqual(execLog, [
            ['docker', 'rm', '-f', 'test-sandbox'],
            ['docker', 'volume', 'rm', '-f', 'test-sandbox-node_modules', 'test-sandbox-packages-a-node_modules'],
        ]);
    });
});

describe('docker sandbox – settings resolution', () => {
    const makeInstance = (git) => {
        const instance = Object.create(docker);
        instance.config = {};
        instance.project = { rootPath: '/fake/repo' };
        instance.git = git;
        return instance;
    };

    it('targets the base container from the primary checkout', async () => {
        const settings = await makeInstance({ isWorktree: false }).resolveSettings();

        assert.strictEqual(settings.name, 'kraal-repo-sandbox');
        assert.strictEqual(settings.tag, 'kraal-repo-sandbox');
        assert.strictEqual(settings.commonDir, null);
        assert.strictEqual(settings.workDir, '/app');
    });

    it('suffixes the container name with the sanitized branch inside a worktree', async () => {
        const settings = await makeInstance({
            isWorktree: true,
            branch: 'feat/foo',
            commonDir: '/host/repo/.git',
        }).resolveSettings();

        assert.strictEqual(settings.name, 'kraal-repo-sandbox--feat-foo');
        assert.strictEqual(settings.tag, 'kraal-repo-sandbox');
        assert.strictEqual(settings.commonDir, '/host/repo/.git');
        assert.strictEqual(settings.workDir, '/app');
    });

    it('rejects inside a worktree on a detached HEAD', async () => {
        await assert.rejects(
            () => makeInstance({ isWorktree: true, branch: null }).resolveSettings(),
            /detached HEAD/
        );
    });
});

describe('docker sandbox – Dockerfile generation', () => {
    it('embeds the install script via a quoted heredoc run with sh -e', () => {
        const dockerfile = docker.buildDockerfile('apt-get install -y sqlite3\n');

        assert.match(dockerfile, /COPY <<'KRAAL_INSTALL' \/tmp\/install\.sh\napt-get install -y sqlite3\nKRAAL_INSTALL\n/);
        assert.match(dockerfile, /RUN sh -e \/tmp\/install\.sh && rm \/tmp\/install\.sh/);
    });

    it('omits the install layers when the install script is blank or missing', () => {
        for (const install of [undefined, '', '   \n']) {
            const dockerfile = docker.buildDockerfile(install);
            assert.ok(!dockerfile.includes('install.sh'), `expected no install layers for ${JSON.stringify(install)}`);
        }
    });

    it('grows the heredoc terminator until no script line collides with it', () => {
        const dockerfile = docker.buildDockerfile('echo before\nKRAAL_INSTALL\necho after\n');

        assert.match(dockerfile, /COPY <<'KRAAL_INSTALL_' \/tmp\/install\.sh/);
        assert.match(dockerfile, /echo after\nKRAAL_INSTALL_\n/);
    });

    it('never references .kraal', () => {
        const dockerfile = docker.buildDockerfile('echo hi\n');

        assert.ok(!dockerfile.includes('.kraal'));
    });

    it('runs the first-boot install at /app', () => {
        const dockerfile = docker.buildDockerfile();

        assert.match(dockerfile, /CMD \["sh", "-c", "cd \/app && /);
    });
});

describe('docker sandbox – exec args', () => {
    const makeInstance = (identity) => {
        const instance = Object.create(docker);
        instance.params = {};
        instance.git = { identity };
        instance.resolveSettings = async () => ({
            name: 'test-sandbox',
            config: {},
            workDir: '/app',
        });
        return instance;
    };

    it('injects the host git identity as GIT_AUTHOR_*/GIT_COMMITTER_* env', async () => {
        const args = await makeInstance({ name: 'Jane Host', email: 'jane@host.example' })
            .resolveExecArgs('git commit', {});

        assert.ok(args.includes('GIT_AUTHOR_NAME=Jane Host'));
        assert.ok(args.includes('GIT_COMMITTER_NAME=Jane Host'));
        assert.ok(args.includes('GIT_AUTHOR_EMAIL=jane@host.example'));
        assert.ok(args.includes('GIT_COMMITTER_EMAIL=jane@host.example'));
    });

    it('omits git identity env when the host has none', async () => {
        const args = await makeInstance({ name: null, email: null })
            .resolveExecArgs('git commit', {});

        assert.ok(!args.some(arg => arg.startsWith('GIT_AUTHOR')));
        assert.ok(!args.some(arg => arg.startsWith('GIT_COMMITTER')));
    });
});

describe('docker sandbox – volume resolution', () => {
    const roots = [];

    const makeProjectRoot = (files) => {
        const root = mkdtempSync(join(tmpdir(), 'kraal-docker-test-'));
        roots.push(root);
        for (const [path, content] of Object.entries(files)) {
            mkdirSync(join(root, dirnameOf(path)), { recursive: true });
            writeFileSync(join(root, path), content);
        }
        return root;
    };

    const dirnameOf = (path) => path.split('/').slice(0, -1).join('/') || '.';

    after(() => {
        for (const root of roots) rmSync(root, { recursive: true, force: true });
    });

    it('always shadows the root node_modules', () => {
        const root = makeProjectRoot({});

        const volumes = docker.resolveVolumes(root, 'test-sandbox');

        assert.deepStrictEqual(volumes, [
            { path: 'node_modules', volume: 'test-sandbox-node_modules' },
        ]);
    });

    it('shadows node_modules of every workspace dir containing a package.json', () => {
        const root = makeProjectRoot({
            'package.json': JSON.stringify({ workspaces: ['packages/*', 'packages/@scope/*'] }),
            'packages/a/package.json': '{}',
            'packages/@scope/b/package.json': '{}',
            'packages/no-manifest/README.md': '',
        });

        const paths = docker.resolveVolumes(root, 'test-sandbox').map(({ path }) => path);

        assert.deepStrictEqual(paths.sort(), [
            'node_modules',
            'packages/@scope/b/node_modules',
            'packages/a/node_modules',
        ]);
    });

    it('sanitizes volume names to docker-legal characters', () => {
        const root = makeProjectRoot({
            'package.json': JSON.stringify({ workspaces: ['packages/@scope/*'] }),
            'packages/@scope/b/package.json': '{}',
        });

        const { volume } = docker.resolveVolumes(root, 'test-sandbox')
            .find(({ path }) => path.startsWith('packages/'));

        assert.strictEqual(volume, 'test-sandbox-packages--scope-b-node_modules');
    });

    it('dedupes workspaces that overlap each other', () => {
        const root = makeProjectRoot({
            'package.json': JSON.stringify({ workspaces: ['packages/*', 'packages/a'] }),
            'packages/a/package.json': '{}',
        });

        const paths = docker.resolveVolumes(root, 'test-sandbox').map(({ path }) => path);

        assert.deepStrictEqual(paths, ['node_modules', 'packages/a/node_modules']);
    });
});
