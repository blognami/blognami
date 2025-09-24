


import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`subscribable`, () => Workspace.run(async _ => {

    const { subscribables, newsletter, users, subscriptions } = _.database;

    assert.equal(await subscribables.count(), 0);

    await newsletter;

    assert.equal(await subscribables.count(), 1);

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


    assert.equal(await user1.isSubscribedToNewsletter(), false);
    assert.equal(await user2.isSubscribedToNewsletter(), false);

    await user1.subscribeTo(newsletter);
    assert.equal(await subscriptions.count(), 1);
    assert.equal(await user1.isSubscribedToNewsletter(), true);

    await user2.subscribeTo(newsletter);
    assert.equal(await subscriptions.count(), 2);
    assert.equal(await user2.isSubscribedToNewsletter(), true);

    await user1.unsubscribeFrom(newsletter);
    assert.equal(await subscriptions.count(), 1);
    assert.equal(await user1.isSubscribedToNewsletter(), false);

    await user2.unsubscribeFrom(newsletter);
    assert.equal(await subscriptions.count(), 0);
    assert.equal(await user2.isSubscribedToNewsletter(), false);
}));
