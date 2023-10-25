

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`site`, () => Workspace.run(async _ => {
    const { site, sites } = _.database;

    const { title } = await site;

    expect(title).toBe('');

    expect(await sites.count()).toBe(1);
}));

if(process.env.TENANCY == 'multi'){
    test(`site with multi-tenancy and tenant exists`, () => Workspace.run(async _ => {
        const { tenant, site, sites } = _.database;

        expect(typeof await tenant).toBe('object');

        expect(typeof await site).toBe('object');

        expect(await sites.count()).toBe(1);

        expect(await _.database.run(`select * from sites`).length).toBe(1);
    }));
    

    test(`site with multi-tenancy and tenant does not exist`, () => Workspace.run(async _ => {
        _.initialParams._headers.host = 'example.com';
        
        const { tenant, site, sites } = _.database;

        expect(typeof await tenant).toBe('undefined');

        expect(typeof await site).toBe('undefined');

        expect(await sites.count()).toBe(0);

        expect(await _.database.run(`select * from sites`).length).toBe(0);
    }));
}