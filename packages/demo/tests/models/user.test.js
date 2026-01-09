
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

        // Create a user in portal database
        const portalUserId = await portal.runInNewWorkspace(async function(){
            const { id } = await this.database.users.insert({
                name: 'Portal User',
                email: 'testuser@example.com',
                role: 'user'
            });
            return id;
        });

        // Create a different tenant and a user with the same email
        const tenant = await database.tenants.insert({
            name: 'tenant1',
            host: 'tenant1.example.com'
        });

        const tenantUserId = await tenant.runInNewWorkspace(async function(){
            const { id } = await this.database.users.insert({
                name: 'Tenant User',
                email: 'testuser@example.com',
                role: 'admin'
            });
            return id;
        });

        // Get a fresh reference to the tenant user from a new workspace
        const foundPortalUser = await tenant.runInNewWorkspace(async function(){
            const tenantUser = await this.database.users.where({ id: tenantUserId }).first();
            return tenantUser.portalUser;
        });

        assert.equal(foundPortalUser.id, portalUserId);
        assert.equal(foundPortalUser.name, 'Portal User');
        assert.equal(foundPortalUser.email, 'testuser@example.com');
    }));

    test(`portalUser creates new user in portal database if not exists`, () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        // Get the existing portal tenant
        const portal = await database.tenants.where({ name: 'portal' }).first();

        // Count initial users (may have admin from seed)
        const initialCount = await portal.runInNewWorkspace(async function(){
            return this.database.users.count();
        });

        // Create a tenant and user with a unique email
        const tenant = await database.tenants.insert({
            name: 'tenant1',
            host: 'tenant1.example.com'
        });

        const tenantUserId = await tenant.runInNewWorkspace(async function(){
            const { id } = await this.database.users.insert({
                name: 'Tenant User',
                email: 'newuser@example.com',
                role: 'admin'
            });
            return id;
        });

        // portalUser should create a new user in portal database
        const createdPortalUser = await tenant.runInNewWorkspace(async function(){
            const tenantUser = await this.database.users.where({ id: tenantUserId }).first();
            return tenantUser.portalUser;
        });

        const newCount = await portal.runInNewWorkspace(async function(){
            return this.database.users.count();
        });

        assert.equal(newCount, initialCount + 1);
        assert.equal(createdPortalUser.name, 'Tenant User');
        assert.equal(createdPortalUser.email, 'newuser@example.com');
        assert.equal(createdPortalUser.role, 'user');
    }));

    test(`portalUser returns same user on multiple calls`, () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        // Get the existing portal tenant
        const portal = await database.tenants.where({ name: 'portal' }).first();

        const initialCount = await portal.runInNewWorkspace(async function(){
            return this.database.users.count();
        });

        // Create a tenant and user
        const tenant = await database.tenants.insert({
            name: 'tenant1',
            host: 'tenant1.example.com'
        });

        const tenantUserId = await tenant.runInNewWorkspace(async function(){
            const { id } = await this.database.users.insert({
                name: 'Tenant User',
                email: 'user@example.com',
                role: 'admin'
            });
            return id;
        });

        // Multiple calls should return the same user (test in a single workspace)
        const { portalUser1Id, portalUser2Id } = await tenant.runInNewWorkspace(async function(){
            const tenantUser = await this.database.users.where({ id: tenantUserId }).first();
            const portalUser1 = await tenantUser.portalUser;
            const portalUser2 = await tenantUser.portalUser;
            return { portalUser1Id: portalUser1.id, portalUser2Id: portalUser2.id };
        });

        assert.equal(portalUser1Id, portalUser2Id);

        // Should only create one new user
        const newCount = await portal.runInNewWorkspace(async function(){
            return this.database.users.count();
        });
        assert.equal(newCount, initialCount + 1);
    }));

    test(`tenant.runInNewWorkspace provides isolated context`, () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        const [tenant1, tenant2] = await Promise.all([
            database.tenants.insert({ name: 'tenant1', host: 'tenant1.example.com' }),
            database.tenants.insert({ name: 'tenant2', host: 'tenant2.example.com' })
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
