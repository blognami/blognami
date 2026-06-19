
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';

import 'haberdash/node';
import { defer } from 'haberdash';
import { Agent, Playbook, importAll } from '../index.js';
import service from './agent.js';

function mockThis(config = {}) {
    return {
        defer,
        context: { root: { getOrCreate: (name, fn) => fn() } },
        config: Promise.resolve(config),
    };
}

describe('agent service – prompt rendering', () => {
    let savedCreate;
    let savedMixins;
    let capturedArgs;

    beforeEach(async () => {
        await importAll();
        savedCreate = Agent.create;
        savedMixins = { ...Playbook.mixins };
        capturedArgs = null;
        Agent.create = () => ({
            run(args) {
                capturedArgs = args;
                return { exitCode: 0 };
            }
        });
    });

    afterEach(() => {
        Agent.create = savedCreate;
        Playbook.mixins = savedMixins;
        Playbook.clearCache();
    });

    it('renders callback systemPrompt to string', async () => {
        const agent = service.create.call(mockThis());
        await agent.run({ systemPrompt: ({ line }) => line('hi') });
        assert.strictEqual(capturedArgs.systemPrompt, 'hi');
    });

    it('forwards null systemPrompt as undefined', async () => {
        const agent = service.create.call(mockThis());
        await agent.run({ systemPrompt: null });
        assert.strictEqual(capturedArgs.systemPrompt, undefined);
    });

    it('forwards undefined systemPrompt as undefined', async () => {
        const agent = service.create.call(mockThis());
        await agent.run({ systemPrompt: undefined });
        assert.strictEqual(capturedArgs.systemPrompt, undefined);
    });

    it('forwards undefined prompt as empty string', async () => {
        const agent = service.create.call(mockThis());
        await agent.run({ prompt: undefined });
        assert.strictEqual(capturedArgs.prompt, '');
    });

    it('passes string systemPrompt and prompt through unchanged', async () => {
        const agent = service.create.call(mockThis());
        await agent.run({ systemPrompt: 'sys', prompt: 'usr' });
        assert.strictEqual(capturedArgs.systemPrompt, 'sys');
        assert.strictEqual(capturedArgs.prompt, 'usr');
    });

    it('forwards configured provider options', async () => {
        const agent = service.create.call(mockThis({ agent: { providers: { claude: { model: 'sonnet' } } } }));
        await agent.run({});
        assert.strictEqual(capturedArgs.model, 'sonnet');
    });

    it('run-time options override configured provider options', async () => {
        const agent = service.create.call(mockThis({ agent: { providers: { claude: { model: 'sonnet' } } } }));
        await agent.run({ model: 'haiku' });
        assert.strictEqual(capturedArgs.model, 'haiku');
    });

    it('playbooks() callback renders with live registry state', async () => {
        Object.keys(Playbook.mixins).forEach(name => Playbook.unregister(name));
        const fakePath = '/tmp/test-playbook/index.md';
        Playbook.register('test', {
            meta(){ this.filePaths.push(fakePath); }
        });

        const agent = service.create.call(mockThis());
        await agent.run({ systemPrompt: ({ playbooks }) => playbooks() });

        assert.ok(capturedArgs.systemPrompt.includes('## Read the playbooks first'));
        assert.ok(capturedArgs.systemPrompt.includes(fakePath));
    });
});
