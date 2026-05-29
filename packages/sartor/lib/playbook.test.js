import { describe, it } from 'node:test';
import assert from 'node:assert';

import 'haberdash/node';
import { Playbook, importAll } from 'sartor';

describe('Playbook', () => {
    it('is a class (function)', () => {
        assert.strictEqual(typeof Playbook, 'function');
    });

    it('has a FileImporter (AbstractImportableRegistry mixin)', () => {
        assert.ok(Playbook.FileImporter);
    });

    it('has sartor playbook registered after importAll', async () => {
        await importAll();
        assert.ok(Playbook.names.includes('sartor'));
    });
});
