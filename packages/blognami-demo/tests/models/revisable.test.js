
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`revisable`, () => Workspace.run(async _ => {
    const { revisables, revisions, users, posts } = _.database;

    assert.equal(await revisables.count(), 0);
    assert.equal(await revisions.count(), 0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const post = await posts.insert({
        userId: user.id,
        title: 'Foo'
    });

    assert.equal(await revisables.count(), 1);
    assert.equal(await revisions.count(), 0);
    assert.equal(await post.revisions.count(), 0);

    await post.update({
        body: 'Apple'
    });

    assert.equal(await revisions.count(), 0);
    assert.equal(await post.revisions.count(), 0);

    await post.update({
        revisionUserId: user.id,
        body: 'Apple'
    });

    assert.equal(await revisions.count(), 0);
    assert.equal(await post.revisions.count(), 0);

    await post.update({
        revisionUserId: user.id,
        body: 'Pear'
    });

    assert.equal(await revisions.count(), 1);
    assert.equal(await post.revisions.count(), 1);

    await post.update({
        revisionUserId: user.id,
        body: 'Plum'
    });

    assert.equal(await revisions.count(), 2);
    assert.equal(await post.revisions.count(), 2);

    const post2 = await posts.insert({
        revisionUserId: user.id,
        userId: user.id,
        title: 'Foo',
    });

    assert.equal(await revisions.count(), 2);
    assert.equal(await post.revisions.count(), 2);
    assert.equal(await post2.revisions.count(), 0);

    const post3 = await posts.insert({
        revisionUserId: user.id,
        userId: user.id,
        title: 'Foo',
        body: 'Apple',
    });

    assert.equal(await revisions.count(), 3);
    assert.equal(await post.revisions.count(), 2);
    assert.equal(await post2.revisions.count(), 0);
    assert.equal(await post3.revisions.count(), 1);
}));

