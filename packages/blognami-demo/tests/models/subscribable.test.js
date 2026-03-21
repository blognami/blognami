


import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`subscribable`, () => Workspace.run(async _ => {

    const { subscribables, newsletter, users, subscriptions } = _.database;

    const initialSubscribablesCount = await subscribables.count();

    await newsletter;

    assert.equal(await subscribables.count(), initialSubscribablesCount + 1);

    assert.equal(await subscriptions.count(), 0);

    const user1 = await users.insert({
        name: 'User 1',
        email: 'user1@example.com',
        role: 'user'
    });

    const user2 = await users.insert({
        name: 'User 2',
        email: 'user2@example.com',
        role: 'user'
    });


    assert.equal(await newsletter.isSubscribed(user1), false);
    assert.equal(await newsletter.isSubscribed(user2), false);

    await newsletter.subscribe(user1);
    assert.equal(await subscriptions.count(), 1);
    assert.equal(await newsletter.isSubscribed(user1), true);

    await newsletter.subscribe(user2);
    assert.equal(await subscriptions.count(), 2);
    assert.equal(await newsletter.isSubscribed(user2), true);

    await newsletter.unsubscribe(user1);
    assert.equal(await subscriptions.count(), 1);
    assert.equal(await newsletter.isSubscribed(user1), false);

    await newsletter.unsubscribe(user2);
    assert.equal(await subscriptions.count(), 0);
    assert.equal(await newsletter.isSubscribed(user2), false);
}));
