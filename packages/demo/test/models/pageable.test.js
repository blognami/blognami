
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`pageable`, () => Workspace.run(async _ => {
    const { pageables, users, posts, tag } = _.database;

    assert.equal(await pageables.count(), 0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    assert.equal(await pageables.count(), 1);

    const post = await posts.insert({
        userId: user.id,
        title: 'Foo'
    });

    assert.equal(await pageables.count(), 2);
}));
