
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`user`, () => Workspace.run(async _ => {
    const { users, posts, tags, tagableTags } = _.database;

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
    test(`portalUser finds existing user in portal database by email`, () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        // Get the existing portal tenant (created by seed_database)
        const portal = await database.tenants.where({ name: 'portal' }).first();
        const portalDatabase = await portal.scopedDatabase;

        // Create a user in portal database
        const portalUser = await portalDatabase.users.insert({
            name: 'Portal User',
            email: 'testuser@example.com',
            role: 'user'
        });

        // Create a different tenant and a user with the same email
        const tenant = await database.tenants.insert({
            name: 'tenant1',
            host: 'tenant1.example.com'
        });

        const tenantDatabase = await tenant.scopedDatabase;

        const tenantUser = await tenantDatabase.users.insert({
            name: 'Tenant User',
            email: 'testuser@example.com',
            role: 'admin'
        });

        // portalUser should find the existing portal user
        const foundPortalUser = await tenantUser.portalUser;

        assert.equal(foundPortalUser.id, portalUser.id);
        assert.equal(foundPortalUser.name, 'Portal User');
        assert.equal(foundPortalUser.email, 'testuser@example.com');
    }));

    test(`portalUser creates new user in portal database if not exists`, () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        // Get the existing portal tenant
        const portal = await database.tenants.where({ name: 'portal' }).first();
        const portalDatabase = await portal.scopedDatabase;

        // Count initial users (may have admin from seed)
        const initialCount = await portalDatabase.users.count();

        // Create a tenant and user with a unique email
        const tenant = await database.tenants.insert({
            name: 'tenant1',
            host: 'tenant1.example.com'
        });

        const tenantDatabase = await tenant.scopedDatabase;

        const tenantUser = await tenantDatabase.users.insert({
            name: 'Tenant User',
            email: 'newuser@example.com',
            role: 'admin'
        });

        // portalUser should create a new user in portal database
        const createdPortalUser = await tenantUser.portalUser;

        assert.equal(await portalDatabase.users.count(), initialCount + 1);
        assert.equal(createdPortalUser.name, 'Tenant User');
        assert.equal(createdPortalUser.email, 'newuser@example.com');
        assert.equal(createdPortalUser.role, 'user');
    }));

    test(`portalUser returns same user on multiple calls`, () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        // Get the existing portal tenant
        const portal = await database.tenants.where({ name: 'portal' }).first();
        const portalDatabase = await portal.scopedDatabase;

        const initialCount = await portalDatabase.users.count();

        // Create a tenant and user
        const tenant = await database.tenants.insert({
            name: 'tenant1',
            host: 'tenant1.example.com'
        });

        const tenantDatabase = await tenant.scopedDatabase;

        const tenantUser = await tenantDatabase.users.insert({
            name: 'Tenant User',
            email: 'user@example.com',
            role: 'admin'
        });

        // Multiple calls should return the same user
        const portalUser1 = await tenantUser.portalUser;
        const portalUser2 = await tenantUser.portalUser;

        assert.equal(portalUser1.id, portalUser2.id);
        // Should only create one new user
        assert.equal(await portalDatabase.users.count(), initialCount + 1);
    }));
}
