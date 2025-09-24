
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`session`, () => Workspace.run(async _ => {
    const { sessions, users } = _.database;

    assert.equal(await sessions.count(), 0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const session = await sessions.insert({
        userId: user.id,
        passString: 'foo'
    });

    assert.equal(await sessions.count(), 1);

    assert.equal(await session.user.name, 'Admin');
}));

