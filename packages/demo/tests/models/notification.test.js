
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`notification`, () => Workspace.run(async function(){
    const { users } = this.database;

    assert.equal(await users.count(), 0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    assert.equal(await users.count(), 1);

    assert.equal(await user.notifications.count(), 0);

    await user.notify(({ line }) => {
        line('Hello world');
    });

    assert.equal(await user.notifications.count(), 1);

    let notification = await user.notifications.first();
    assert.equal(notification.body, 'Hello world');
    assert.equal(notification.userId, user.id);
    assert.equal(notification.counter, 1);
    assert.equal(notification.createdAt.toString(), notification.updatedAt.toString());

    await new Promise(resolve => setTimeout(resolve, 1000));

    await user.notify(({ line }) => {
        line('Hello world');
    });
    assert.equal(await user.notifications.count(), 1);

    notification = await user.notifications.first();
    assert.equal(notification.counter, 2);
    assert.notEqual(notification.createdAt.toString(), notification.updatedAt.toString());

    await user.notify(({ line }) => {
        line('Hello world 2');
    });
    assert.equal(await user.notifications.count(), 2);
    
    await user.deliverNotifications({ force: true });

    assert.equal(await user.notifications.count(), 0);
}));

