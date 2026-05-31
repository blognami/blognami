import { describe, it } from 'node:test';
import assert from 'node:assert';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import 'haberdash/node';
import { Playbook } from 'cardoon';
import './md.js';

describe('Playbook FileImporter md', () => {
    const root = join(tmpdir(), 'test-playbooks');

    it('has a handler keyed on md', () => {
        assert.ok(Playbook.FileImporter.mixins['md']);
    });

    it('registers foo from foo/index.md', async () => {
        const importer = Playbook.FileImporter.create('md', {
            dirPath: root,
            filePath: join(root, 'foo', 'index.md')
        });
        await importer.importFile();
        assert.ok(Playbook.names.includes('foo'));
        assert.strictEqual(Playbook.for('foo').filePaths[0], join(root, 'foo', 'index.md'));
    });

    it('registers nothing from foo/other.md', async () => {
        const namesBefore = [...Playbook.names];
        const importer = Playbook.FileImporter.create('md', {
            dirPath: root,
            filePath: join(root, 'foo', 'other.md')
        });
        await importer.importFile();
        assert.deepStrictEqual(Playbook.names, namesBefore);
    });

    it('registers nothing from root index.md', async () => {
        const namesBefore = [...Playbook.names];
        const importer = Playbook.FileImporter.create('md', {
            dirPath: root,
            filePath: join(root, 'index.md')
        });
        await importer.importFile();
        assert.deepStrictEqual(Playbook.names, namesBefore);
    });

    it('registers foo/bar from foo/bar/index.md', async () => {
        const importer = Playbook.FileImporter.create('md', {
            dirPath: root,
            filePath: join(root, 'foo', 'bar', 'index.md')
        });
        await importer.importFile();
        assert.ok(Playbook.names.includes('foo/bar'));
    });
});
