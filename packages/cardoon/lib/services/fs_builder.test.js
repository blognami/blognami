
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import os from 'os';
import fs from 'node:fs/promises';
import path from 'path';

import 'haberdash/node';
import { FileSystem } from 'haberdash';
import service from './fs_builder.js';

describe('fsBuilder', () => {
    let tmpDir;
    let originalCwd;
    let builder;

    beforeEach(async () => {
        tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cardoon-fs-builder-'));
        originalCwd = process.cwd();
        process.chdir(tmpDir);
        builder = service.create.call(service);
    });

    afterEach(async () => {
        process.chdir(originalCwd);
        await fs.rm(tmpDir, { recursive: true });
    });

    it('generateFile creates nested file with rendered content', async () => {
        await builder.generateFile('foo/bar.txt', ({ line }) => line('hello'));
        const filePath = path.join(tmpDir, 'foo', 'bar.txt');
        assert.ok(await FileSystem.instance.exists(filePath));
        assert.strictEqual(await FileSystem.instance.readFile(filePath), 'hello');
    });

    it('generateDir creates a directory', async () => {
        await builder.generateDir('baz', () => {});
        const dirPath = path.join(tmpDir, 'baz');
        assert.ok(await FileSystem.instance.exists(dirPath));
    });
});
