import { describe, it } from 'node:test';
import assert from 'node:assert';

import 'haberdash/node';
import { RELAY_KEY, relayEnv, StreamProcessor } from './claude.js';

function msg(...blocks) {
    return JSON.stringify({ type: 'assistant', message: { content: blocks } });
}

function tool(name, input = {}) {
    return { type: 'tool_use', name, input };
}

function text(t) {
    return { type: 'text', text: t };
}

describe('StreamProcessor – tool_use formatting', () => {
    it('single tool block emits header then bullet', () => {
        const lines = [];
        const sp = new StreamProcessor(line => lines.push(line));
        sp.processLine(msg(tool('Read', { file_path: '/a.js' })));
        assert.deepStrictEqual(lines, ['Tool call(s):', '- Read /a.js']);
    });

    it('two consecutive tool blocks emit one header', () => {
        const lines = [];
        const sp = new StreamProcessor(line => lines.push(line));
        sp.processLine(msg(
            tool('Read', { file_path: '/a.js' }),
            tool('Edit', { file_path: '/a.js' })
        ));
        assert.deepStrictEqual(lines, ['Tool call(s):', '- Read /a.js', '- Edit /a.js']);
    });

    it('text then tool block inserts blank line and header', () => {
        const lines = [];
        const sp = new StreamProcessor(line => lines.push(line));
        sp.processLine(msg(text('some text'), tool('Bash', { command: 'ls -la' })));
        assert.deepStrictEqual(lines, ['some text', '', 'Tool call(s):', '- Bash ls -la']);
    });

    it('tool then text block inserts blank line', () => {
        const lines = [];
        const sp = new StreamProcessor(line => lines.push(line));
        sp.processLine(msg(tool('Bash', { command: 'ls -la' }), text('some text')));
        assert.deepStrictEqual(lines, ['Tool call(s):', '- Bash ls -la', '', 'some text']);
    });

    it('tool → text → tool resets header on new streak', () => {
        const lines = [];
        const sp = new StreamProcessor(line => lines.push(line));
        sp.processLine(msg(tool('Bash', { command: 'ls -la' })));
        sp.processLine(msg(text('some text')));
        sp.processLine(msg(tool('Read', { file_path: '/a.js' })));
        assert.deepStrictEqual(lines, [
            'Tool call(s):', '- Bash ls -la',
            '', 'some text',
            '', 'Tool call(s):', '- Read /a.js'
        ]);
    });

    it('tool with empty input emits bullet with no trailing space', () => {
        const lines = [];
        const sp = new StreamProcessor(line => lines.push(line));
        sp.processLine(msg(tool('ToolName', {})));
        assert.deepStrictEqual(lines, ['Tool call(s):', '- ToolName']);
    });
});

describe('relayEnv', () => {
    it('adds the relay blob and leaves other keys unchanged', () => {
        const out = relayEnv({ FOO: 'a', BAR: 'b' });
        assert.strictEqual(out.FOO, 'a');
        assert.strictEqual(out.BAR, 'b');
        assert.deepStrictEqual(JSON.parse(out[RELAY_KEY]), { FOO: 'a', BAR: 'b' });
    });

    it('restores stripped keys from the inbound blob', () => {
        const blob = JSON.stringify({ CLAUDE_CODE_OAUTH_TOKEN: 'tok', EXTRA: 'e' });
        const out = relayEnv({ [RELAY_KEY]: blob, PATH: '/container' });
        assert.strictEqual(out.CLAUDE_CODE_OAUTH_TOKEN, 'tok');
        assert.strictEqual(out.EXTRA, 'e');
    });

    it('current env wins over the blob (no clobber)', () => {
        const blob = JSON.stringify({ PATH: '/host', HOME: '/Users/jody' });
        const out = relayEnv({ [RELAY_KEY]: blob, PATH: '/container', HOME: '/home/cardoon' });
        assert.strictEqual(out.PATH, '/container');
        assert.strictEqual(out.HOME, '/home/cardoon');
    });

    it('excludes the relay key from the outbound blob (no exponential growth)', () => {
        const inner = JSON.stringify({ A: '1' });
        const out = relayEnv({ [RELAY_KEY]: inner, B: '2' });
        const outer = JSON.parse(out[RELAY_KEY]);
        assert.ok(!(RELAY_KEY in outer), 'outbound blob must not contain the relay key');
        assert.strictEqual(outer.A, '1');
        assert.strictEqual(outer.B, '2');
    });

    it('survives a round trip across two nesting levels', () => {
        const l0 = relayEnv({ CLAUDE_CODE_OAUTH_TOKEN: 'tok', PATH: '/host' });
        // Simulate the strip + new context: keep only PATH and the relay blob, drop the token.
        const stripped = { [RELAY_KEY]: l0[RELAY_KEY], PATH: '/container' };
        const l1 = relayEnv(stripped);
        assert.strictEqual(l1.CLAUDE_CODE_OAUTH_TOKEN, 'tok');
        assert.strictEqual(l1.PATH, '/container');
    });
});
