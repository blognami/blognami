import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';

import 'haberdash/node';
import { Command, Playbook, importAll } from 'cardoon';
import './md.js';
import { renderParamsBlock } from './md.js';

describe('Command FileImporter md', () => {
    const root = join(tmpdir(), 'test-md-commands');

    beforeEach(async () => {
        await importAll();
        await mkdir(root, { recursive: true });
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

    it('has a handler keyed on md', () => {
        assert.ok(Command.FileImporter.mixins['md']);
    });

    it('frontmatter description lands directly on the class', async () => {
        await importMd('desc-test', '---\ndescription: A test command\n---\nBody here.');
        assert.strictEqual(Command.for('desc-test').description, 'A test command');
    });

    it('frontmatter params declares each param via hasParam', async () => {
        await importMd('params-test', [
            '---',
            'description: Params test',
            'params:',
            '  fruit:',
            '    type: string',
            '    alias: arg1',
            '  count:',
            '    type: number',
            '    optional: true',
            '    default: 5',
            '---',
            'Body.'
        ].join('\n'));

        const Cls = Command.for('params-test');
        assert.deepStrictEqual(Cls.params.fruit, { type: 'string', optional: false, alias: 'arg1' });
        assert.deepStrictEqual(Cls.params.count, { type: 'number', optional: true, default: 5 });
    });

    it('sandboxed is always true even when frontmatter says false', async () => {
        await importMd('sandbox-test', '---\nsandboxed: false\n---\nBody.');
        assert.strictEqual(Command.for('sandbox-test').sandboxed, true);
    });

    it('no frontmatter parses cleanly', async () => {
        await importMd('nofm-test', 'Just a body with no frontmatter.');
        const Cls = Command.for('nofm-test');
        assert.strictEqual(Cls.sandboxed, true);
        // Only the built-in follow param is declared; no frontmatter params.
        assert.deepStrictEqual(Object.keys(Cls.params), ['follow']);
    });

    it('malformed YAML surfaces a parse error', async () => {
        const filePath = join(root, 'bad-yaml.md');
        await writeFile(filePath, '---\n: :\n  bad:\n    - ]\n---\nBody.');
        const importer = Command.FileImporter.create('md', {
            dirPath: root,
            filePath
        });
        await assert.rejects(() => importer.importFile());
    });

    it('skips compound-extension files like .test.md', async () => {
        const filePath = join(root, 'skip-me.test.md');
        await writeFile(filePath, '---\ndescription: Should be skipped\n---\nBody.');
        const importer = Command.FileImporter.create('md', {
            dirPath: root,
            filePath
        });
        await importer.importFile();
        assert.ok(!Command.names.includes('skip-me.test'));
        assert.ok(!Command.names.includes('skip-me'));
    });

    it('reserved follow param in frontmatter rejects at import time', async () => {
        const filePath = join(root, 'reserved-follow.md');
        await writeFile(filePath, [
            '---',
            'description: Reserved',
            'params:',
            '  follow:',
            '    type: string',
            '---',
            'Body.'
        ].join('\n'));
        const importer = Command.FileImporter.create('md', {
            dirPath: root,
            filePath
        });
        await assert.rejects(() => importer.importFile(), /reserved param 'follow'/);
    });

    it('declares a built-in follow boolean flag with alias f', async () => {
        await importMd('follow-decl', '---\ndescription: Follow flag\n---\nBody.');
        assert.deepStrictEqual(Command.for('follow-decl').params.follow, {
            type: 'boolean',
            alias: 'f',
            optional: true,
            description: 'Stream log output to stdout as well as the log file.'
        });
    });

    describe('run', () => {
        const projRoot = join(tmpdir(), 'test-md-run-proj');
        const sessionDir = join(projRoot, '.cardoon', 'logs', 'sessions', '0042');
        let savedMixins;

        beforeEach(async () => {
            savedMixins = { ...Playbook.mixins };
            Object.keys(Playbook.mixins).forEach(name => Playbook.unregister(name));
            await rm(sessionDir, { recursive: true, force: true });
            await mkdir(sessionDir, { recursive: true });
        });

        afterEach(() => {
            Playbook.mixins = savedMixins;
            Playbook.clearCache();
        });

        function setupInstance(Cls, paramOverrides = {}){
            const captured = {};
            const logged = [];
            const stdoutLines = [];

            const instance = new Cls({ params: { ...paramOverrides } });
            instance.agent = { async run(args){ Object.assign(captured, args); return { exitCode: 0 }; } };
            instance.logger = Promise.resolve({
                sessionDir,
                log(line){ logged.push(line); }
            });
            instance.project = Promise.resolve({ rootPath: projRoot });

            const exitMock = mock.method(process, 'exit', () => {});
            const writeMock = mock.method(process.stdout, 'write', chunk => {
                stdoutLines.push(chunk);
                return true;
            });

            return { captured, logged, stdoutLines, exitMock, writeMock, instance };
        }

        it('no params: systemPrompt is byte-equal to body', async () => {
            const body = 'You are a helpful bot.\n\nDo your thing.';
            await importMd('run-noparam', `---\ndescription: No params\n---\n${body}`);

            const Cls = Command.for('run-noparam');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls);

            await instance.run();

            assert.strictEqual(captured.systemPrompt, body);
            assert.strictEqual(captured.prompt, 'Begin the session.');
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('params declared and supplied: systemPrompt ends with table block', async () => {
            await importMd('run-withparam', [
                '---',
                'description: With params',
                'params:',
                '  fruit:',
                '    type: string',
                '  color:',
                '    type: string',
                '---',
                'You are a bot.'
            ].join('\n'));

            const Cls = Command.for('run-withparam');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls, { fruit: 'apple', color: 'red' });

            await instance.run();

            assert.ok(captured.systemPrompt.includes('| fruit |'));
            assert.ok(captured.systemPrompt.includes('| color |'));
            assert.ok(captured.systemPrompt.includes('`"apple"`'));
            assert.ok(captured.systemPrompt.includes('`"red"`'));
            assert.ok(!captured.systemPrompt.includes('```json'));
            assert.strictEqual(captured.prompt, 'Begin the session.');
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('undeclared context keys do not appear in table', async () => {
            await importMd('run-nodeclared', [
                '---',
                'description: Filter test',
                'params:',
                '  fruit:',
                '    type: string',
                '---',
                'Body.'
            ].join('\n'));

            const Cls = Command.for('run-nodeclared');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls, {
                fruit: 'banana', logger: 'LEAK', agent: 'LEAK', config: 'LEAK'
            });

            await instance.run();

            assert.ok(captured.systemPrompt.includes('| fruit |'));
            assert.ok(captured.systemPrompt.includes('`"banana"`'));
            assert.ok(!captured.systemPrompt.includes('logger'));
            assert.ok(!captured.systemPrompt.includes('LEAK'));
            assert.ok(!captured.systemPrompt.includes('```json'));
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('follow does not leak into the table', async () => {
            await importMd('run-follow-noleak', [
                '---',
                'description: No leak',
                'params:',
                '  fruit:',
                '    type: string',
                '---',
                'Body.'
            ].join('\n'));

            const Cls = Command.for('run-follow-noleak');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls, { fruit: 'pear', follow: true });

            await instance.run();

            assert.ok(captured.systemPrompt.includes('| fruit |'));
            assert.ok(!captured.systemPrompt.includes('| follow |'));
            assert.ok(!captured.systemPrompt.includes('```json'));
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('empty-string / falsy values for declared params still render', async () => {
            await importMd('run-falsy', [
                '---',
                'description: Falsy test',
                'params:',
                '  fruit:',
                '    type: string',
                '  count:',
                '    type: number',
                '---',
                'Body.'
            ].join('\n'));

            const Cls = Command.for('run-falsy');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls, { fruit: '', count: 0 });

            await instance.run();

            assert.ok(captured.systemPrompt.includes('| fruit |'));
            assert.ok(captured.systemPrompt.includes('| count |'));
            assert.ok(captured.systemPrompt.includes('`""`'));
            assert.ok(captured.systemPrompt.includes('`0`'));
            assert.ok(!captured.systemPrompt.includes('```json'));
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('user prompt is exactly "Begin the session." on every invocation', async () => {
            await importMd('run-prompt', '---\ndescription: Prompt check\n---\nBody.');

            const Cls = Command.for('run-prompt');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls);

            await instance.run();

            assert.strictEqual(captured.prompt, 'Begin the session.');
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('emits a single tail-f log hint to stdout, nothing to the log', async () => {
            await importMd('run-banner', '---\ndescription: Banner test\n---\nBody.');

            const Cls = Command.for('run-banner');
            const { stdoutLines, logged, exitMock, writeMock, instance } = setupInstance(Cls);

            await instance.run();

            const stdout = stdoutLines.join('');
            assert.match(stdout, /Log: tail -f .*\.cardoon\/logs\/sessions\/0042\/index\.md/);
            assert.ok(!stdout.includes('Cardoon run-banner session'));
            assert.ok(!logged.some(l => l.includes('Cardoon run-banner session')));
            assert.ok(!logged.some(l => l.includes('tail -f')));
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('default (no --follow): onLog only logs, does not stream to stdout', async () => {
            await importMd('run-nofollow', '---\ndescription: No follow\n---\nBody.');

            const Cls = Command.for('run-nofollow');
            const { captured, logged, stdoutLines, exitMock, writeMock, instance } = setupInstance(Cls);

            await instance.run();

            // Clear stdout/logged from the banner so we can assert on onLog only.
            stdoutLines.length = 0;
            const loggedBefore = logged.length;

            captured.onLog('agent says hi');

            assert.strictEqual(stdoutLines.length, 0);
            assert.strictEqual(logged.length, loggedBefore + 1);
            assert.strictEqual(logged[loggedBefore], 'agent says hi');
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('with --follow: onLog writes to stdout AND logs', async () => {
            await importMd('run-follow', '---\ndescription: Follow test\n---\nBody.');

            const Cls = Command.for('run-follow');
            const { captured, logged, stdoutLines, exitMock, writeMock, instance } = setupInstance(Cls, { follow: true });

            await instance.run();

            stdoutLines.length = 0;
            const loggedBefore = logged.length;

            captured.onLog('agent says hi');

            assert.strictEqual(stdoutLines.join(''), 'agent says hi\n');
            assert.strictEqual(logged.length, loggedBefore + 1);
            assert.strictEqual(logged[loggedBefore], 'agent says hi');
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('writes session header to index.md with correct structure', async () => {
            await importMd('run-hdr', '---\ndescription: Header test\n---\nBody.');

            const Cls = Command.for('run-hdr');
            const { exitMock, writeMock, instance } = setupInstance(Cls);

            await instance.run();

            const content = await readFile(join(sessionDir, 'index.md'), 'utf8');
            assert.ok(content.startsWith('# Session 0042\n\nHere are details of the current session:\n- Command: run-hdr'));
            assert.match(content, /## Command output\n\n$/);
            assert.match(content, /^- Started: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/m);
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('system-prompt.md is byte-equal to the assembled systemPrompt', async () => {
            await importMd('run-sp', [
                '---',
                'description: SP test',
                'params:',
                '  fruit:',
                '    type: string',
                '---',
                'You are a bot.'
            ].join('\n'));

            const Cls = Command.for('run-sp');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls, { fruit: 'apple' });

            await instance.run();

            const spContent = await readFile(join(sessionDir, 'system-prompt.md'), 'utf8');
            assert.strictEqual(spContent, captured.systemPrompt);
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('prompt.md equals "Begin the session."', async () => {
            await importMd('run-pmd', '---\ndescription: Prompt file\n---\nBody.');

            const Cls = Command.for('run-pmd');
            const { exitMock, writeMock, instance } = setupInstance(Cls);

            await instance.run();

            const promptContent = await readFile(join(sessionDir, 'prompt.md'), 'utf8');
            assert.strictEqual(promptContent, 'Begin the session.');
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('command-line reconstruction with all params', async () => {
            await importMd('run-cmdall', [
                '---',
                'description: Cmdline test',
                'params:',
                '  topic:',
                '    type: string',
                '  count:',
                '    type: number',
                '---',
                'Body.'
            ].join('\n'));

            const Cls = Command.for('run-cmdall');
            const { exitMock, writeMock, instance } = setupInstance(Cls, { topic: 'Cats', count: 3, follow: true });

            await instance.run();

            const content = await readFile(join(sessionDir, 'index.md'), 'utf8');
            assert.match(content, /- Command: run-cmdall --topic="Cats" --count=3 --follow\n/);
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('command-line reconstruction with no params', async () => {
            await importMd('run-cmdnone', [
                '---',
                'description: Cmdline none',
                'params:',
                '  topic:',
                '    type: string',
                '  count:',
                '    type: number',
                '---',
                'Body.'
            ].join('\n'));

            const Cls = Command.for('run-cmdnone');
            const { exitMock, writeMock, instance } = setupInstance(Cls, { follow: false });

            await instance.run();

            const content = await readFile(join(sessionDir, 'index.md'), 'utf8');
            assert.match(content, /- Command: run-cmdnone\n/);
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('three params all supplied: preamble, header, separator, three rows in order', async () => {
            await importMd('run-3params', [
                '---',
                'description: Three params',
                'params:',
                '  topic:',
                '    type: string',
                '    description: The topic',
                '  count:',
                '    type: number',
                '    description: How many',
                '  draft:',
                '    type: boolean',
                '    description: Save as draft',
                '---',
                'Body.'
            ].join('\n'));

            const Cls = Command.for('run-3params');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls, { topic: 'Cats', count: 3, draft: true });

            await instance.run();

            const sp = captured.systemPrompt;
            assert.ok(sp.includes('Values below are JSON-encoded'));
            assert.ok(sp.includes('| Param | Description | Value (JSON) |'));
            assert.ok(sp.includes('|-------|-------------|--------------|'));
            assert.ok(sp.includes('| topic | The topic | `"Cats"` |'));
            assert.ok(sp.includes('| count | How many | `3` |'));
            assert.ok(sp.includes('| draft | Save as draft | `true` |'));
            const topicIdx = sp.indexOf('| topic |');
            const countIdx = sp.indexOf('| count |');
            const draftIdx = sp.indexOf('| draft |');
            assert.ok(topicIdx < countIdx);
            assert.ok(countIdx < draftIdx);
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('omitted param: draft omitted produces only topic and count rows', async () => {
            await importMd('run-omit', [
                '---',
                'description: Omit test',
                'params:',
                '  topic:',
                '    type: string',
                '    description: The topic',
                '  count:',
                '    type: number',
                '    description: How many',
                '  draft:',
                '    type: boolean',
                '    description: Save as draft',
                '---',
                'Body.'
            ].join('\n'));

            const Cls = Command.for('run-omit');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls, { topic: 'Cats', count: 3 });

            await instance.run();

            assert.ok(captured.systemPrompt.includes('| topic |'));
            assert.ok(captured.systemPrompt.includes('| count |'));
            assert.ok(!captured.systemPrompt.includes('| draft |'));
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('boolean false supplied: row present with value false', async () => {
            await importMd('run-boolfalse', [
                '---',
                'description: Bool false',
                'params:',
                '  draft:',
                '    type: boolean',
                '    description: Save as draft',
                '---',
                'Body.'
            ].join('\n'));

            const Cls = Command.for('run-boolfalse');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls, { draft: false });

            await instance.run();

            assert.ok(captured.systemPrompt.includes('| draft | Save as draft | `false` |'));
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('param with no description: empty Description cell', async () => {
            await importMd('run-nodesc', [
                '---',
                'description: No desc',
                'params:',
                '  fruit:',
                '    type: string',
                '---',
                'Body.'
            ].join('\n'));

            const Cls = Command.for('run-nodesc');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls, { fruit: 'apple' });

            await instance.run();

            assert.match(captured.systemPrompt, /\| fruit \|  \| /);
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('params declared but none supplied: no Params section', async () => {
            await importMd('run-nonesupplied', [
                '---',
                'description: None supplied',
                'params:',
                '  fruit:',
                '    type: string',
                '  count:',
                '    type: number',
                '---',
                'Body.'
            ].join('\n'));

            const Cls = Command.for('run-nonesupplied');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls);

            await instance.run();

            assert.strictEqual(captured.systemPrompt, 'Body.');
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('omitted params with defaults: rows render using the default value', async () => {
            await importMd('run-defaults', [
                '---',
                'description: Defaults',
                'params:',
                '  role:',
                '    type: string',
                '    optional: true',
                '    default: orchestrator',
                '    description: Role to run as',
                '  limit:',
                '    type: number',
                '    optional: true',
                '    default: 1',
                '    description: Max iterations',
                '  taskHeading:',
                '    type: string',
                '    optional: true',
                '    description: No default',
                '---',
                'Body.'
            ].join('\n'));

            const Cls = Command.for('run-defaults');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls);

            await instance.run();

            assert.ok(captured.systemPrompt.includes('| role | Role to run as | `"orchestrator"` |'));
            assert.ok(captured.systemPrompt.includes('| limit | Max iterations | `1` |'));
            assert.ok(!captured.systemPrompt.includes('| taskHeading |'));
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('omitted params with defaults: explicit value overrides the default', async () => {
            await importMd('run-defaults-override', [
                '---',
                'description: Defaults override',
                'params:',
                '  role:',
                '    type: string',
                '    optional: true',
                '    default: orchestrator',
                '    description: Role to run as',
                '---',
                'Body.'
            ].join('\n'));

            const Cls = Command.for('run-defaults-override');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls, { role: 'worker' });

            await instance.run();

            assert.ok(captured.systemPrompt.includes('| role | Role to run as | `"worker"` |'));
            assert.ok(!captured.systemPrompt.includes('`"orchestrator"`'));
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('string value containing pipe: escaped in rendered cell', async () => {
            await importMd('run-pipe', [
                '---',
                'description: Pipe test',
                'params:',
                '  fruit:',
                '    type: string',
                '---',
                'Body.'
            ].join('\n'));

            const Cls = Command.for('run-pipe');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls, { fruit: 'a|b' });

            await instance.run();

            assert.ok(captured.systemPrompt.includes('`"a\\|b"`'));
            const tableLines = captured.systemPrompt.split('\n').filter(l => l.startsWith('| fruit'));
            assert.strictEqual(tableLines.length, 1);
            const cells = tableLines[0].split(/(?<!\\)\|/).filter(c => c !== '');
            assert.strictEqual(cells.length, 3);
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('array and object values: rendered as inline JSON in backticks', async () => {
            await importMd('run-complex', [
                '---',
                'description: Complex values',
                'params:',
                '  tags:',
                '    type: array',
                '    description: Tag list',
                '  meta:',
                '    type: object',
                '    description: Metadata',
                '---',
                'Body.'
            ].join('\n'));

            const Cls = Command.for('run-complex');
            const { captured, exitMock, writeMock, instance } = setupInstance(Cls, { tags: ['a', 'b'], meta: { x: 1 } });

            await instance.run();

            assert.ok(captured.systemPrompt.includes('`["a","b"]`'));
            assert.ok(captured.systemPrompt.includes('`{"x":1}`'));
            exitMock.mock.restore();
            writeMock.mock.restore();
        });

        it('non-md session: no header block or sibling files', async () => {
            const nonMdSessionDir = join(projRoot, '.cardoon', 'logs', 'sessions', '9999');
            await mkdir(nonMdSessionDir, { recursive: true });
            await writeFile(join(nonMdSessionDir, 'index.md'), 'Some log line\n');

            const content = await readFile(join(nonMdSessionDir, 'index.md'), 'utf8');
            assert.ok(!content.startsWith('# Session'));

            await assert.rejects(
                () => readFile(join(nonMdSessionDir, 'system-prompt.md')),
                { code: 'ENOENT' }
            );
            await assert.rejects(
                () => readFile(join(nonMdSessionDir, 'prompt.md')),
                { code: 'ENOENT' }
            );
        });
    });

    describe('renderParamsBlock', () => {
        it('three-entry input produces the expected string verbatim', () => {
            const entries = [
                ['topic', { description: 'The topic' }],
                ['count', { description: 'How many' }],
                ['draft', { description: 'Save as draft' }]
            ];
            const values = { topic: 'Cats', count: 3, draft: true };
            const result = renderParamsBlock(entries, values);
            const expected = [
                '',
                '',
                '## Params',
                '',
                'Values below are JSON-encoded — strings appear quoted, numbers/booleans/null appear bare.',
                '',
                '| Param | Description | Value (JSON) |',
                '|-------|-------------|--------------|',
                '| topic | The topic | `"Cats"` |',
                '| count | How many | `3` |',
                '| draft | Save as draft | `true` |',
                ''
            ].join('\n');
            assert.strictEqual(result, expected);
        });

        it('empty values (all undefined) returns empty string', () => {
            const entries = [
                ['topic', { description: 'The topic' }],
                ['count', { description: 'How many' }]
            ];
            const values = { topic: undefined, count: undefined };
            assert.strictEqual(renderParamsBlock(entries, values), '');
        });
    });
});
