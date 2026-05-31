
import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFile, mkdir, rm } from 'node:fs/promises';

import 'haberdash/node';
import { Command, Playbook, importAll } from '../index.js';
import './md.js';

describe('md command playbook integration', () => {
    const root = join(tmpdir(), 'test-md-playbooks');
    const projRoot = join(tmpdir(), 'test-md-pb-proj');
    const sessionDir = join(projRoot, '.cardoon', 'logs', 'sessions', '0042');
    let savedMixins;

    beforeEach(async () => {
        await importAll();
        savedMixins = { ...Playbook.mixins };
        await mkdir(root, { recursive: true });
        await rm(sessionDir, { recursive: true, force: true });
        await mkdir(sessionDir, { recursive: true });
    });

    afterEach(() => {
        Playbook.mixins = savedMixins;
        Playbook.clearCache();
    });

    async function importMd(name, content){
        const filePath = join(root, `${name}.md`);
        await writeFile(filePath, content);
        const importer = Command.FileImporter.create('md', {
            dirPath: root,
            filePath
        });
        await importer.importFile();
    }

    function setupInstance(Cls){
        const captured = {};
        const instance = new Cls({ params: {} });
        instance.agent = { async run(args){ Object.assign(captured, args); return { exitCode: 0 }; } };
        instance.logger = Promise.resolve({
            sessionDir,
            log(line){}
        });
        instance.project = Promise.resolve({ rootPath: projRoot });

        const exitMock = mock.method(process, 'exit', () => {});
        const writeMock = mock.method(process.stdout, 'write', () => true);

        return { captured, exitMock, writeMock, instance };
    }

    it('with one playbook: systemPrompt starts with mandatory heading and contains playbook path', async () => {
        Object.keys(Playbook.mixins).forEach(name => Playbook.unregister(name));

        const fakePath = '/tmp/fake-playbook/index.md';
        Playbook.register('fake', {
            meta(){ this.filePaths.push(fakePath); }
        });

        const body = 'You are a bot.';
        await importMd('run-pb-one', `---\ndescription: Playbook test\n---\n${body}`);

        const Cls = Command.for('run-pb-one');
        const { captured, exitMock, writeMock, instance } = setupInstance(Cls);

        await instance.run();

        assert.ok(captured.systemPrompt.startsWith('## Read the playbooks first — mandatory\n'));
        assert.ok(captured.systemPrompt.includes(`- \`${fakePath}\``));
        assert.ok(captured.systemPrompt.includes(body));
        exitMock.mock.restore();
        writeMock.mock.restore();
    });

    it('with empty registry: systemPrompt equals body only', async () => {
        Object.keys(Playbook.mixins).forEach(name => Playbook.unregister(name));

        const body = 'You are a bot.';
        await importMd('run-pb-empty', `---\ndescription: No playbook test\n---\n${body}`);

        const Cls = Command.for('run-pb-empty');
        const { captured, exitMock, writeMock, instance } = setupInstance(Cls);

        await instance.run();

        assert.strictEqual(captured.systemPrompt, body);
        exitMock.mock.restore();
        writeMock.mock.restore();
    });
});
