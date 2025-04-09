
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset, modules } from './helpers.js';

beforeEach(reset);

test(`site`, () => Workspace.run(async _ => {
    const { site, sites } = _.database;

    const { title } = await site;

    assert.equal(title, '');

    assert.equal(await sites.count(), 1);
}));

if(modules.includes('@sintra/multi-tenant')){
    test(`site with multi-tenancy and tenant exists`, () => Workspace.run(async _ => {
        const { tenant, site, sites } = _.database;

        assert.equal(typeof await tenant, 'object');

        assert.equal(typeof await site, 'object');

        assert.equal(await sites.count(), 1);

        assert.equal(await _.database.run(`select * from sites`).length, 1);
    }));
    

    test(`site with multi-tenancy and tenant does not exist`, () => Workspace.run(async _ => {
        _.initialParams._headers.host = 'example.com';
        
        const { tenant, site, sites } = _.database;

        assert.equal(typeof await tenant, 'undefined');

        assert.equal(typeof await site, 'undefined');

        assert.equal(await sites.count(), 0);

        assert.equal(await _.database.run(`select * from sites`).length, 0);
    }));
}