import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import 'haberdash/node';
import { defer } from 'haberdash';
import service from './logger.js';

function mockThis(project) {
    return {
        ...service,
        defer,
        context: { root: { getOrCreate: (_name, fn) => fn() } },
        project: Promise.resolve(project),
    };
}

describe('logger – session dir allocation', () => {
    let root;
    let savedEnv;

    beforeEach(() => {
        root = mkdtempSync(join(tmpdir(), 'sartor-logger-'));
        savedEnv = process.env.SARTOR_PARENT_SESSION_DIR;
        delete process.env.SARTOR_PARENT_SESSION_DIR;
    });

    afterEach(() => {
        if (savedEnv === undefined) delete process.env.SARTOR_PARENT_SESSION_DIR;
        else process.env.SARTOR_PARENT_SESSION_DIR = savedEnv;
        rmSync(root, { recursive: true, force: true });
    });

    it('allocates under .sartor/logs/sessions when env unset', async () => {
        const logger = await service.create.call(mockThis({ rootPath: root }));
        assert.strictEqual(logger.sessionDir, join(root, '.sartor', 'logs', 'sessions', '0001'));
    });

    it('allocates under <parent>/sessions when SARTOR_PARENT_SESSION_DIR set', async () => {
        const parent = join(root, '.sartor', 'logs', 'sessions', '0003');
        process.env.SARTOR_PARENT_SESSION_DIR = parent;
        const logger = await service.create.call(mockThis({ rootPath: root }));
        assert.strictEqual(logger.sessionDir, join(parent, 'sessions', '0001'));
    });

    it('increments the counter for subsequent allocations under same parent', async () => {
        const parent = join(root, '.sartor', 'logs', 'sessions', '0003');
        process.env.SARTOR_PARENT_SESSION_DIR = parent;

        const logger1 = await service.create.call(mockThis({ rootPath: root }));
        assert.strictEqual(logger1.sessionDir, join(parent, 'sessions', '0001'));

        const logger2 = await service.create.call(mockThis({ rootPath: root }));
        assert.strictEqual(logger2.sessionDir, join(parent, 'sessions', '0002'));
    });

    it('logger.log writes to index.md in the session dir', async () => {
        const logger = await service.create.call(mockThis({ rootPath: root }));
        await logger.log('hello');
        const indexPath = join(root, '.sartor', 'logs', 'sessions', '0001', 'index.md');
        assert.ok(existsSync(indexPath));
        assert.strictEqual(readFileSync(indexPath, 'utf8'), 'hello\n');
    });
});
