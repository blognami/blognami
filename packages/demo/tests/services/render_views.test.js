

import '../../lib/index.js';

import test from 'node:test';
import assert from 'node:assert';

import { Workspace } from 'pinstripe';

test(`renderViews`, () => Workspace.run(async function(){
    try {
        await this.renderViews('_test/fixtures/render_views/_*');
        assert.fail('Should have thrown an error');
    } catch(error) {
        assert.equal(error.message, "Cannot read properties of undefined (reading 'bar')");
    }
}));

