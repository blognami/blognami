
import test from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { findInPath } from './project.js';

// realpathSync: on macOS the temp dir is a symlink (/tmp -> /private/tmp)
// and findInPath returns resolved paths.
const makeTree = () => mkdtempSync(join(realpathSync(tmpdir()), 'pinstripe-project-test-'));

test('findInPath stops at a .git file (linked worktree)', async t => {
    const root = makeTree();
    t.after(() => rmSync(root, { recursive: true, force: true }));

    writeFileSync(join(root, 'package.json'), '{}');
    mkdirSync(join(root, '.git'));
    const worktree = join(root, 'worktrees', 'feature');
    mkdirSync(worktree, { recursive: true });
    writeFileSync(join(worktree, 'package.json'), '{}');
    writeFileSync(join(worktree, '.git'), `gitdir: ${join(root, '.git')}\n`);

    assert.deepEqual(
        await findInPath('package.json', worktree),
        [join(worktree, 'package.json')]
    );
});

test('findInPath stops at a .git directory (primary checkout)', async t => {
    const outer = makeTree();
    t.after(() => rmSync(outer, { recursive: true, force: true }));

    writeFileSync(join(outer, 'package.json'), '{}');
    const repo = join(outer, 'repo');
    mkdirSync(join(repo, '.git'), { recursive: true });
    writeFileSync(join(repo, 'package.json'), '{}');
    const nested = join(repo, 'nested');
    mkdirSync(nested);

    assert.deepEqual(
        await findInPath('package.json', nested),
        [join(repo, 'package.json')]
    );
});

test('findInPath collects all matches up to the .git boundary', async t => {
    const root = makeTree();
    t.after(() => rmSync(root, { recursive: true, force: true }));

    mkdirSync(join(root, '.git'));
    writeFileSync(join(root, 'package.json'), '{}');
    const nested = join(root, 'a', 'b');
    mkdirSync(nested, { recursive: true });
    writeFileSync(join(nested, 'package.json'), '{}');

    assert.deepEqual(
        await findInPath('package.json', nested),
        [join(nested, 'package.json'), join(root, 'package.json')]
    );
});
