
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

if(process.env.TENANCY === 'multi'){
    test('new demo tenant starts with lifecycleStatus active', () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        const tenant = await database.tenants.insert({});

        assert.equal(tenant.subscriptionTier, 'demo');
        assert.equal(tenant.lifecycleStatus, 'active');
    }));

    test('expired demo transitions to lifecycleStatus paused', () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        const tenant = await database.tenants.insert({
            subscriptionTier: 'demo',
            lifecycleStatus: 'active',
            subscriptionExpiresAt: new Date(Date.now() - 1000)
        });

        assert.equal(tenant.lifecycleStatus, 'active');

        const now = new Date();
        await database.tenants.where({
            subscriptionTier: 'demo',
            lifecycleStatus: 'active',
            subscriptionExpiresAtLt: now
        }).update({ lifecycleStatus: 'paused' });

        const updated = await database.tenants.where({ id: tenant.id }).first();
        assert.equal(updated.lifecycleStatus, 'paused');
    }));

    test('paused demo with elapsed retention window is purged', () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        const retentionDays = 30;
        const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

        const tenant = await database.tenants.insert({
            subscriptionTier: 'demo',
            lifecycleStatus: 'paused',
            subscriptionExpiresAt: new Date(cutoff.getTime() - 1000)
        });

        await database.tenants.where({
            subscriptionTier: 'demo',
            lifecycleStatus: 'paused',
            subscriptionExpiresAtLt: cutoff
        }).delete();

        const deleted = await database.tenants.where({ id: tenant.id }).first();
        assert.equal(deleted, undefined);
    }));

    test('subscribing a paused tenant resets lifecycleStatus to active', () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        const tenant = await database.tenants.insert({
            subscriptionTier: 'demo',
            lifecycleStatus: 'paused',
            subscriptionExpiresAt: new Date(Date.now() - 1000)
        });

        assert.equal(tenant.lifecycleStatus, 'paused');

        await tenant.runHook('afterSubscribe', { args: [{ plan: 'starter', interval: 'monthly' }] });

        const updated = await database.tenants.where({ id: tenant.id }).first();
        assert.equal(updated.lifecycleStatus, 'active');
        assert.equal(updated.subscriptionTier, 'paid');
    }));

    test('paid tenants are never paused or purged', () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        const tenant = await database.tenants.insert({
            subscriptionTier: 'paid',
            lifecycleStatus: 'active',
            subscriptionExpiresAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        });

        // Pause query should not affect paid tenants
        const now = new Date();
        await database.tenants.where({
            subscriptionTier: 'demo',
            lifecycleStatus: 'active',
            subscriptionExpiresAtLt: now
        }).update({ lifecycleStatus: 'paused' });

        let current = await database.tenants.where({ id: tenant.id }).first();
        assert.equal(current.lifecycleStatus, 'active');

        // Purge query should not affect paid tenants
        const retentionDays = 30;
        const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
        await database.tenants.where({
            subscriptionTier: 'demo',
            lifecycleStatus: 'paused',
            subscriptionExpiresAtLt: cutoff
        }).delete();

        current = await database.tenants.where({ id: tenant.id }).first();
        assert.notEqual(current, undefined);
        assert.equal(current.lifecycleStatus, 'active');
    }));
}
