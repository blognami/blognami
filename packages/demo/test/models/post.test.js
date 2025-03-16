
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`post`, () => Workspace.run(async _ => {
    const { users, posts } = _.database;

    assert.equal(await posts.count(), 0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const { id } = await posts.insert({
        userId: user.id,
        title: 'Foo'
    });

    assert.equal(await posts.count(), 1);

    let post = await posts.where({ id }).first();

    assert.equal(post.title, 'Foo');


    assert.equal(await post.user.name, 'Admin');

    await post.update({ title: 'Bar' });

    post = await posts.where({ id }).first();

    assert.equal(post.title, 'Bar');

    await post.delete();

    assert.equal(await posts.count(), 0);
}));
