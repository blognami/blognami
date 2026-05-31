
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';

import 'haberdash/node';
import { Playbook, PromptText, importAll } from './index.js';

describe('PromptText', () => {
    let savedMixins;

    beforeEach(async () => {
        await importAll();
        savedMixins = { ...Playbook.mixins };
    });

    afterEach(() => {
        Playbook.mixins = savedMixins;
        Playbook.clearCache();
    });

    it('renders playbook block with one playbook registered', async () => {
        Object.keys(Playbook.mixins).forEach(name => Playbook.unregister(name));
        const fakePath = '/tmp/fake-playbook/index.md';
        Playbook.register('fake', {
            meta(){
                this.filePaths.push(fakePath);
            }
        });

        const result = (await PromptText.render(({ playbooks }) => playbooks())).toString();

        assert.strictEqual(result, [
            '## Read the playbooks first — mandatory',
            '',
            'Before doing anything else — before replying to the user, before any other action — you **must** read every file below, in full:',
            '',
            `- \`${fakePath}\``,
            '',
            'These playbooks govern the session. Follow their instructions. Load sibling files only when a playbook tells you to.'
        ].join('\n'));
    });

    it('renders empty string with no playbooks registered', async () => {
        Object.keys(Playbook.mixins).forEach(name => Playbook.unregister(name));

        const result = (await PromptText.render(({ playbooks }) => playbooks())).toString();

        assert.strictEqual(result, '');
    });

    it('renders two bullets in registry order with two playbooks', async () => {
        Object.keys(Playbook.mixins).forEach(name => Playbook.unregister(name));
        const pathA = '/tmp/alpha-playbook/index.md';
        const pathB = '/tmp/beta-playbook/index.md';
        Playbook.register('alpha', {
            meta(){ this.filePaths.push(pathA); }
        });
        Playbook.register('beta', {
            meta(){ this.filePaths.push(pathB); }
        });

        const result = (await PromptText.render(({ playbooks }) => playbooks())).toString();

        assert.ok(result.includes(`- \`${pathA}\``));
        assert.ok(result.includes(`- \`${pathB}\``));

        const indexA = result.indexOf(`- \`${pathA}\``);
        const indexB = result.indexOf(`- \`${pathB}\``);
        assert.ok(indexA < indexB, 'alpha bullet should appear before beta bullet (registry order)');
    });
});
