
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

if(process.env.TENANCY === 'multi'){
    test(`tenant (multi)`, () => Workspace.run(async _ => {
        const { tenant } = _.database;

        assert.equal(typeof await tenant, 'object');
    }));
} else {
    test(`tenant`, () => Workspace.run(async _ => {
        const { tenant } = _.database;

        assert.equal(typeof await tenant, 'undefined');
    }));
}
