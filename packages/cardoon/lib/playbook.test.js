import { describe, it } from 'node:test';
import assert from 'node:assert';

import 'haberdash/node';
import { Playbook, importAll } from 'cardoon';

describe('Playbook', () => {
    it('is a class (function)', () => {
        assert.strictEqual(typeof Playbook, 'function');
    });

    it('has a FileImporter (AbstractImportableRegistry mixin)', () => {
        assert.ok(Playbook.FileImporter);
    });

    it('has cardoon playbook registered after importAll', async () => {
        await importAll();
        assert.ok(Playbook.names.includes('cardoon'));
    });
});
