
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`user`, () => Workspace.run(async function() {
    const { users, posts, tags, tagableTags } = this.database;

    assert.equal(await users.count(), 0);

    const { id: userId } = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    assert.equal(await users.count(), 1);

    const user = await users.where({ id: userId }).first();

    assert.equal(user.name, 'Admin');

    assert.equal(await user.posts.count(), 0);

    assert.equal(await user.posts.tags.count(), 0);

    await posts.insert({ userId, title: 'Foo' });

    assert.equal(await user.posts.count(), 1);

    assert.equal(await user.posts.tags.count(), 0);

    const { id: postId } = await posts.insert({ userId, title: 'Foo' });

    assert.equal(await user.posts.count(), 2);

    const appleTag = await tags.insert({ name: 'Apple' });
    const pearTag = await tags.insert({ name: 'Pear' });
    const peachTag = await tags.insert({ name: 'Peach' });

    await tagableTags.insert({ tagId: appleTag.id, tagableId: postId });

    assert.equal(await user.posts.tags.count(), 1);

    const { id: postId2 } = await posts.insert({ userId, title: 'Foo' });


    await tagableTags.insert({ tagId: appleTag.id, tagableId: postId2 });
    await tagableTags.insert({ tagId: pearTag.id, tagableId: postId2 });
    await tagableTags.insert({ tagId: peachTag.id, tagableId: postId2 });

    assert.equal(await user.posts.count(), 3);

    assert.equal(await user.posts.tags.count(), 3);

    assert.equal(await tagableTags.count(), 4);

    await user.posts.delete();

    assert.equal(await tagableTags.count(), 0);
}));

if(process.env.TENANCY === 'multi'){
    test(`tenant.runInNewWorkspace provides isolated context`, () => Workspace.run(async function() {
        const { withoutTenantScope: database } = this.database;

        const [tenant1, tenant2] = await Promise.all([
            database.tenants.insert({}),
            database.tenants.insert({})
        ]);

        const db1TenantId = await tenant1.runInNewWorkspace(async function(){
            return this.database.tenant?.id;
        });

        const db2TenantId = await tenant2.runInNewWorkspace(async function(){
            return this.database.tenant?.id;
        });

        assert.equal(db1TenantId, tenant1.id);
        assert.equal(db2TenantId, tenant2.id);
    }));
}
