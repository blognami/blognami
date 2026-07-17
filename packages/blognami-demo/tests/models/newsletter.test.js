


import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`newsletter`, () => Workspace.run(async function() {
    const { newsletter } = this.database;
    const { enableFree, enableMonthly, enableYearly } = await newsletter;

    assert.equal(enableFree, true);
    assert.equal(enableMonthly, false);
    assert.equal(enableYearly, false);

    assert.equal(await newsletter.subscriptions.count(), 0);
}));

test(`newsletter ctaState`, () => Workspace.run(async function() {
    const { users } = this.database;
    const newsletter = await this.database.newsletter;

    const guest = null;

    const nonSubscriber = await users.insert({
        name: 'Non Subscriber',
        email: 'non-subscriber@example.com',
        role: 'user'
    });

    const freeSubscriber = await users.insert({
        name: 'Free Subscriber',
        email: 'free-subscriber@example.com',
        role: 'user'
    });

    const paidSubscriber = await users.insert({
        name: 'Paid Subscriber',
        email: 'paid-subscriber@example.com',
        role: 'user'
    });

    const admin = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    await newsletter.subscribe(freeSubscriber);
    await newsletter.subscribe(paidSubscriber, { tier: 'paid' });

    // Default config: only the free tier is enabled.
    assert.equal(await newsletter.ctaState(guest), 'subscribe');
    assert.equal(await newsletter.ctaState(nonSubscriber), 'subscribe');
    assert.equal(await newsletter.ctaState(freeSubscriber), 'none');
    assert.equal(await newsletter.ctaState(paidSubscriber), 'none');
    assert.equal(await newsletter.ctaState(admin), 'none');

    // Enable a paid tier: free subscribers should now be prompted to upgrade.
    await newsletter.update({ enableMonthly: true, monthlyPrice: 5 });

    assert.equal(await newsletter.ctaState(guest), 'subscribe');
    assert.equal(await newsletter.ctaState(nonSubscriber), 'subscribe');
    assert.equal(await newsletter.ctaState(freeSubscriber), 'upgrade');
    assert.equal(await newsletter.ctaState(paidSubscriber), 'none');
    assert.equal(await newsletter.ctaState(admin), 'none');

    // No tiers enabled: no CTAs for anyone.
    await newsletter.update({ enableFree: false, enableMonthly: false });

    assert.equal(await newsletter.ctaState(guest), 'none');
    assert.equal(await newsletter.ctaState(nonSubscriber), 'none');
    assert.equal(await newsletter.ctaState(freeSubscriber), 'none');
    assert.equal(await newsletter.ctaState(paidSubscriber), 'none');
    assert.equal(await newsletter.ctaState(admin), 'none');
}));
