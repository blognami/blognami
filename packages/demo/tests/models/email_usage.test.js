
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

if(process.env.TENANCY === 'multi'){
    test('allowanceExceeded returns true when emailsSent meets monthlyEmailAllowance', () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        const tenant = await database.tenants.insert({ subscriptionPlan: 'starter' });
        assert.equal(tenant.monthlyEmailAllowance, 5000);

        const usage = await tenant.emailUsageForCurrentPeriod;
        await usage.update({ emailsSent: 5000 });

        assert.equal(await usage.allowanceExceeded, true);
    }));

    test('allowanceExceeded returns false when emailsSent is below monthlyEmailAllowance', () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        const tenant = await database.tenants.insert({ subscriptionPlan: 'starter' });

        const usage = await tenant.emailUsageForCurrentPeriod;
        await usage.update({ emailsSent: 4999 });

        assert.equal(await usage.allowanceExceeded, false);
    }));

    test('allowanceExceeded returns true when emailsSent exceeds monthlyEmailAllowance', () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        const tenant = await database.tenants.insert({ subscriptionPlan: 'starter' });

        const usage = await tenant.emailUsageForCurrentPeriod;
        await usage.update({ emailsSent: 6000 });

        assert.equal(await usage.allowanceExceeded, true);
    }));

    test('incrementBy updates emailsSent and triggers allowanceExceeded', () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        const tenant = await database.tenants.insert({ subscriptionPlan: 'starter' });

        const usage = await tenant.emailUsageForCurrentPeriod;
        assert.equal(usage.emailsSent, 0);
        assert.equal(await usage.allowanceExceeded, false);

        await usage.incrementBy(5000);
        assert.equal(usage.emailsSent, 5000);
        assert.equal(await usage.allowanceExceeded, true);
    }));

    test('emailUsageForCurrentPeriod creates usage row if none exists', () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        const tenant = await database.tenants.insert({ subscriptionPlan: 'starter' });

        const usage = await tenant.emailUsageForCurrentPeriod;
        assert.equal(usage.emailsSent, 0);
        assert.equal(usage.tenantId, tenant.id);

        const now = new Date();
        const expectedPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        assert.equal(new Date(usage.periodStart).getTime(), expectedPeriodStart.getTime());
    }));

    test('emailUsageForCurrentPeriod returns existing usage row', () => Workspace.run(async _ => {
        const { withoutTenantScope: database } = _.database;

        const tenant = await database.tenants.insert({ subscriptionPlan: 'starter' });

        const usage1 = await tenant.emailUsageForCurrentPeriod;
        await usage1.incrementBy(100);

        const usage2 = await tenant.emailUsageForCurrentPeriod;
        assert.equal(usage2.emailsSent, 100);
        assert.equal(usage1.id, usage2.id);
    }));
}
