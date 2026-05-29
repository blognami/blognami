
import test from 'node:test';
import assert from 'node:assert';
import os from 'node:os';
import path from 'node:path';
import * as nodeFs from 'node:fs/promises';

import { FileSystem } from './file_system.js';

test('FileSystem.instance throws when not patched (readFile)', async () => {
    await assert.rejects(
        () => FileSystem.instance.readFile('/some/path'),
        { message: 'FileSystem not patched — import "haberdash/node" or equivalent' }
    );
});

test('FileSystem.instance throws when not patched (readDir)', async () => {
    await assert.rejects(
        () => FileSystem.instance.readDir('/some/path'),
        { message: 'FileSystem not patched — import "haberdash/node" or equivalent' }
    );
});

test('FileSystem.instance throws when not patched (writeFile)', async () => {
    await assert.rejects(
        () => FileSystem.instance.writeFile('/some/path', 'data'),
        { message: 'FileSystem not patched — import "haberdash/node" or equivalent' }
    );
});

test('FileSystem.instance throws when not patched (mkdir)', async () => {
    await assert.rejects(
        () => FileSystem.instance.mkdir('/some/path'),
        { message: 'FileSystem not patched — import "haberdash/node" or equivalent' }
    );
});

test('FileSystem.instance throws when not patched (exists)', async () => {
    await assert.rejects(
        () => FileSystem.instance.exists('/some/path'),
        { message: 'FileSystem not patched — import "haberdash/node" or equivalent' }
    );
});

test('writeFile + readFile roundtrip (patched)', async () => {
    await import('../node/index.js');
    const tmpDir = await nodeFs.mkdtemp(path.join(os.tmpdir(), 'haberdash-test-'));
    try {
        const filePath = path.join(tmpDir, 'test.txt');
        await FileSystem.instance.writeFile(filePath, 'hello world');
        const content = await FileSystem.instance.readFile(filePath);
        assert.strictEqual(content, 'hello world');
    } finally {
        await nodeFs.rm(tmpDir, { recursive: true });
    }
});

test('mkdir creates a directory listed by readDir (patched)', async () => {
    await import('../node/index.js');
    const tmpDir = await nodeFs.mkdtemp(path.join(os.tmpdir(), 'haberdash-test-'));
    try {
        const subDir = path.join(tmpDir, 'sub');
        await FileSystem.instance.mkdir(subDir);
        const entries = await FileSystem.instance.readDir(tmpDir);
        assert.ok(entries.includes('sub'));
    } finally {
        await nodeFs.rm(tmpDir, { recursive: true });
    }
});

test('exists returns true for existing path and false for missing (patched)', async () => {
    await import('../node/index.js');
    const tmpDir = await nodeFs.mkdtemp(path.join(os.tmpdir(), 'haberdash-test-'));
    try {
        assert.strictEqual(await FileSystem.instance.exists(tmpDir), true);
        assert.strictEqual(await FileSystem.instance.exists(path.join(tmpDir, 'nope')), false);
    } finally {
        await nodeFs.rm(tmpDir, { recursive: true });
    }
});
