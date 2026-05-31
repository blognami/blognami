
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import service from './spinner.js';

describe('spinner', () => {
    let spinner;
    let stderrOutput;
    let originalWrite;
    let originalIsTTY;

    beforeEach(() => {
        stderrOutput = '';
        originalWrite = process.stderr.write;
        originalIsTTY = process.stderr.isTTY;
        process.stderr.write = (chunk) => {
            stderrOutput += chunk;
            return true;
        };
        spinner = service.create.call(service);
    });

    afterEach(() => {
        process.stderr.write = originalWrite;
        process.stderr.isTTY = originalIsTTY;
    });

    it('returns the resolved value', async () => {
        process.stderr.isTTY = false;
        const result = await spinner.run('foo', async () => 'x');
        assert.strictEqual(result, 'x');
    });

    it('TTY path produces stderr ending with success checkmark and containing \\r', async () => {
        process.stderr.isTTY = true;
        await spinner.run('foo', async () => 'x');
        assert.ok(stderrOutput.includes('\r'));
        assert.match(stderrOutput, /✓ foo \(\d+\.\d+s\)\n$/);
    });

    it('non-TTY path produces label… then success line with no escape sequences', async () => {
        process.stderr.isTTY = false;
        await spinner.run('foo', async () => 'x');
        assert.ok(stderrOutput.startsWith('foo…\n'));
        assert.match(stderrOutput, /foo \(\d+\.\d+s\)\n$/);
        assert.ok(!stderrOutput.includes('\x1b'));
        assert.ok(!stderrOutput.includes('\r'));
    });

    it('TTY rejection re-throws original error and stderr ends with failure', async () => {
        process.stderr.isTTY = true;
        const err = new Error('bad');
        await assert.rejects(() => spinner.run('foo', async () => { throw err; }), (thrown) => {
            assert.strictEqual(thrown, err);
            return true;
        });
        assert.match(stderrOutput, /✗ foo failed\n$/);
    });

    it('non-TTY rejection re-throws original error and stderr ends with failure', async () => {
        process.stderr.isTTY = false;
        const err = new Error('bad');
        await assert.rejects(() => spinner.run('foo', async () => { throw err; }), (thrown) => {
            assert.strictEqual(thrown, err);
            return true;
        });
        assert.match(stderrOutput, /foo failed\n$/);
    });

    it('custom opts.success is used in success line, label in failure line', async () => {
        process.stderr.isTTY = false;
        await spinner.run('building', async () => 'ok', { success: 'built' });
        assert.match(stderrOutput, /built \(\d+\.\d+s\)\n$/);
        assert.ok(!stderrOutput.includes('building ('));

        stderrOutput = '';
        await assert.rejects(() => spinner.run('building', async () => { throw new Error('fail'); }, { success: 'built' }));
        assert.match(stderrOutput, /building failed\n$/);
        assert.ok(!stderrOutput.includes('built failed'));
    });

    it('a ~100ms op renders approximately 0.1s', async () => {
        process.stderr.isTTY = false;
        await spinner.run('wait', () => new Promise(resolve => setTimeout(resolve, 100)));
        const match = stderrOutput.match(/\((\d+\.\d+)s\)/);
        assert.ok(match);
        const elapsed = parseFloat(match[1]);
        assert.ok(elapsed >= 0.0 && elapsed <= 0.2, `elapsed ${elapsed}s not in [0.0, 0.2]`);
    });
});
