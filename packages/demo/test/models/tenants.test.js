

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

const COLLECTION_NAMES = ['comments', 'commentables', 'pages', 'pageables', 'posts', 'revisables', 'sessions', 'sites', 'tagables', 'users'];

if(process.env.TENANCY == 'multi'){
    test(`tenant`, () => Workspace.run(async _ => {
        const { tenant, site, users, posts, withoutTenantScope: database } = _.database;

        expect(typeof await tenant).toBe('object');

        await expectItemCollectionCountsToBeCorrect(tenant);

        await expectItemCollectionCountsToBeCorrect(database);

        expect(typeof await site).toBe('object');

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

        expect(typeof await tenant).toBe('undefined');

        await expectItemCollectionCountsToBeCorrect(database);
    }));

    async function expectItemCollectionCountsToBeCorrect(item, expectedCounts = {}){
        for(let collectionName of COLLECTION_NAMES) {
            const expectedCount = expectedCounts[collectionName] ?? 0;
            try {
                expect(await item[collectionName].count()).toBe(expectedCount);
            } catch(e){
                throw new Error(`Expect ${collectionName} count should be correct: ${e.message}`)
            }
        }
    }

} else {
    test(`tenant`, () => Workspace.run(async _ => {
        const { tenant } = _.database;

        expect(typeof await tenant).toBe('undefined');
    }));
}