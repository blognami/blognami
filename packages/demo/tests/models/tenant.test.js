
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

const COLLECTION_NAMES = ['comments', 'commentables', 'pages', 'pageables', 'posts', 'revisables', 'sessions', 'sites', 'tagables', 'users'];

if(process.env.TENANCY === 'multi'){
    test(`tenant`, () => Workspace.run(async _ => {
        const { tenant, site, users, posts, withoutTenantScope: database } = _.database;

        assert.equal(typeof await tenant, 'object');

        await expectItemCollectionCountsToBeCorrect(tenant);

        await expectItemCollectionCountsToBeCorrect(database);

        assert.equal(typeof await site, 'object');

        const user = await users.insert({
            name: 'Admin',
            email: 'admin@example.com',
            role: 'admin'
        });
    
        await posts.insert({
            userId: user.id,
            title: 'Foo'
        });

        await expectItemCollectionCountsToBeCorrect(tenant, { commentables: 1, pageables: 2, posts: 1, revisables: 2, sites: 1, tagables: 1, users: 1 });

        await expectItemCollectionCountsToBeCorrect(database, { commentables: 1, pageables: 2, posts: 1, revisables: 2, sites: 1, tagables: 1, users: 1 });

        await tenant.delete();

        assert.equal(typeof await tenant, 'undefined');

        await expectItemCollectionCountsToBeCorrect(database);
    }));

    test(`runInNewWorkspace should preserve tenant context`, () => Workspace.run(async _ => {
        // Get portal tenant ID using unscoped database
        const portalTenant = await _.database.withoutTenantScope.tenants.where({ name: 'portal' }).first();
        assert.equal(typeof portalTenant, 'object');

        // Create a workspace with portal tenant and test runInNewWorkspace from there
        const tenantIdFromNewWorkspace = await _.runInNewWorkspace(async _ => {
            // Set portal tenant before first database access
            _.initialParams._headers['x-tenant-id'] = portalTenant.id;

            const tenant = await _.database.tenant;
            assert.equal(tenant.id, portalTenant.id, 'Parent workspace should have portal tenant');

            // Now call runInNewWorkspace - this should preserve portal tenant
            return _.runInNewWorkspace(async _ => {
                const tenant = await _.database.tenant;
                return tenant?.id;
            });
        });

        assert.equal(tenantIdFromNewWorkspace, portalTenant.id, 'Child workspace should preserve portal tenant');
    }));

    async function expectItemCollectionCountsToBeCorrect(item, expectedCounts = {}){
        for(let collectionName of COLLECTION_NAMES) {
            const expectedCount = expectedCounts[collectionName] ?? 0;
            try {
                assert.equal(await item[collectionName].count(), expectedCount);
            } catch(e){
                throw new Error(`Expect ${collectionName} count should be correct: ${e.message}`)
            }
        }
    }

} else {
    test(`tenant`, () => Workspace.run(async _ => {
        const { tenant } = _.database;

        assert.equal(typeof await tenant, 'undefined');
    }));
}