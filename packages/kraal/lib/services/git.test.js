
import test from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, existsSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, isAbsolute } from 'node:path';
import { execFileSync } from 'node:child_process';

import { defer } from 'haberdash';

import gitService, { WORKTREES_DIR } from './git.js';

const git = (dir, ...args) => execFileSync(
    'git', ['-c', 'user.name=test', '-c', 'user.email=test@localhost', ...args],
    { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'] }
).toString().trim();

const makeContext = () => {
    const root = {
        getOrCreate(name, fn){
            if(this[name]) return this[name];
            this[name] = fn();
            return this[name];
        }
    };
    return { root };
};

const makeRepo = () => {
    // realpathSync: on macOS the temp dir is a symlink (/tmp -> /private/tmp)
    // and git reports worktree paths resolved.
    const dir = realpathSync(mkdtempSync(join(tmpdir(), 'kraal-git-test-')));
    git(dir, 'init', '-b', 'main');
    writeFileSync(join(dir, 'README.md'), 'hello\n');
    git(dir, 'add', '.');
    git(dir, 'commit', '-m', 'init');
    return dir;
};

const createGit = (dir) => {
    const instance = Object.create(gitService);
    Object.assign(instance, {
        defer,
        bindProps(names){ return Object.fromEntries(names.map(name => [name, this[name].bind(this)])); },
        context: makeContext(),
        project: { rootPath: dir, exists: true }
    });
    return instance.create();
};

test('branch returns the checked-out branch of the project repo', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'kraal-git-test-'));
    try {
        execFileSync('git', ['init', '-b', 'trunk'], { cwd: dir, stdio: 'ignore' });
        const service = createGit(dir);
        assert.equal(await service.branch, 'trunk');
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
});

test('identity returns the host user.name and user.email', async t => {
    const dir = makeRepo();
    t.after(() => rmSync(dir, { recursive: true, force: true }));

    execFileSync('git', ['config', 'user.name', 'Jane Host'], { cwd: dir });
    execFileSync('git', ['config', 'user.email', 'jane@host.example'], { cwd: dir });

    const service = createGit(dir);
    assert.deepEqual(await service.identity, { name: 'Jane Host', email: 'jane@host.example' });
});

test('branch is null outside a git repo', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'kraal-git-test-'));
    try {
        const service = createGit(dir);
        assert.equal(await service.branch, null);
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
});

test('ensureWorktree creates the branch and worktree when neither exists', async t => {
    const dir = makeRepo();
    t.after(() => rmSync(dir, { recursive: true, force: true }));

    const service = createGit(dir);
    const path = await service.ensureWorktree('foo');

    assert.equal(path, join(dir, WORKTREES_DIR, 'foo'));
    assert.equal(git(dir, 'rev-parse', '--verify', 'refs/heads/foo'), git(dir, 'rev-parse', 'HEAD'));
    assert.equal(git(path, 'branch', '--show-current'), 'foo');

    // gitdir pointer rewritten to a relative path; git still works from the worktree.
    const gitdir = readFileSync(join(path, '.git'), 'utf8').replace(/^gitdir:\s*/, '').trim();
    assert.ok(!isAbsolute(gitdir), `expected relative gitdir, got ${gitdir}`);
    assert.equal(git(path, 'status', '--porcelain'), '');
    assert.ok(git(dir, 'worktree', 'list').includes(path));
});

test('ensureWorktree reuses an existing worktree and checks out an existing branch', async t => {
    const dir = makeRepo();
    t.after(() => rmSync(dir, { recursive: true, force: true }));

    git(dir, 'branch', 'bar');
    const service = createGit(dir);
    const path = await service.ensureWorktree('bar');
    assert.equal(git(path, 'branch', '--show-current'), 'bar');

    // Second call is a no-op on the same path.
    assert.equal(await service.ensureWorktree('bar'), path);
});

test('ensureWorktree recovers after the worktree directory is wiped', async t => {
    const dir = makeRepo();
    t.after(() => rmSync(dir, { recursive: true, force: true }));

    const service = createGit(dir);
    const path = await service.ensureWorktree('foo');
    rmSync(path, { recursive: true, force: true });

    assert.equal(await service.ensureWorktree('foo'), path);
    assert.equal(git(path, 'branch', '--show-current'), 'foo');
});

test('removeWorktree deletes the worktree but keeps the branch', async t => {
    const dir = makeRepo();
    t.after(() => rmSync(dir, { recursive: true, force: true }));

    const service = createGit(dir);
    const path = await service.ensureWorktree('foo');
    await service.removeWorktree('foo');

    assert.ok(!existsSync(path));
    assert.ok(!git(dir, 'worktree', 'list').includes(path));
    assert.equal(git(dir, 'rev-parse', '--verify', 'refs/heads/foo'), git(dir, 'rev-parse', 'HEAD'));
});

test('ensureWorktree and removeWorktree are no-ops when the branch matches the checked-out one', async t => {
    const dir = makeRepo();
    t.after(() => rmSync(dir, { recursive: true, force: true }));

    const service = createGit(dir);
    assert.equal(await service.ensureWorktree('main'), null);
    await service.removeWorktree('main');
    assert.ok(!existsSync(join(dir, WORKTREES_DIR)));
});

test('ensureWorktree rejects invalid branch names', async t => {
    const dir = makeRepo();
    t.after(() => rmSync(dir, { recursive: true, force: true }));

    await assert.rejects(() => createGit(dir).ensureWorktree('../evil'));
    await assert.rejects(() => createGit(dir).ensureWorktree('no spaces'));
});
