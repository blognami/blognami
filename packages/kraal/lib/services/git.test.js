
import test from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

import { defer } from 'haberdash';

import gitService from './git.js';

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

test('isWorktree is false and commonDir is the .git dir in a primary checkout', async t => {
    const dir = makeRepo();
    t.after(() => rmSync(dir, { recursive: true, force: true }));

    const service = createGit(dir);
    assert.equal(await service.isWorktree, false);
    assert.equal(await service.commonDir, join(dir, '.git'));
});

test('isWorktree is true and commonDir points at the primary .git in a linked worktree', async t => {
    const dir = makeRepo();
    // realpathSync: on macOS the temp dir is a symlink (/tmp -> /private/tmp)
    // and git reports resolved worktree paths.
    const parent = realpathSync(mkdtempSync(join(tmpdir(), 'kraal-git-test-')));
    t.after(() => {
        rmSync(parent, { recursive: true, force: true });
        rmSync(dir, { recursive: true, force: true });
    });

    const worktreePath = join(parent, 'worktree');
    git(dir, 'worktree', 'add', worktreePath, '-b', 'foo');

    const service = createGit(worktreePath);
    assert.equal(await service.isWorktree, true);
    assert.equal(await service.commonDir, join(dir, '.git'));
    assert.equal(await service.branch, 'foo');
});

test('isWorktree is false and commonDir is null outside a git repo', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'kraal-git-test-'));
    try {
        const service = createGit(dir);
        assert.equal(await service.isWorktree, false);
        assert.equal(await service.commonDir, null);
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
});
