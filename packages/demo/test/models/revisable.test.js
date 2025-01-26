

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`revisable`, () => Workspace.run(async _ => {
    const { revisables, revisions, users, posts } = _.database;

    expect(await revisables.count()).toBe(0);
    expect(await revisions.count()).toBe(0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const post = await posts.insert({
        userId: user.id,
        title: 'Foo'
    });

    expect(await revisables.count()).toBe(1);
    expect(await revisions.count()).toBe(0);
    expect(await post.revisions.count()).toBe(0);

    await post.update({
        body: 'Apple'
    });

    expect(await revisions.count()).toBe(0);
    expect(await post.revisions.count()).toBe(0);

    await post.update({
        revisionUserId: user.id,
        body: 'Apple'
    });

    expect(await revisions.count()).toBe(0);
    expect(await post.revisions.count()).toBe(0);

    await post.update({
        revisionUserId: user.id,
        body: 'Pear'
    });

    expect(await revisions.count()).toBe(1);
    expect(await post.revisions.count()).toBe(1);

    await post.update({
        revisionUserId: user.id,
        body: 'Plum'
    });

    expect(await revisions.count()).toBe(2);
    expect(await post.revisions.count()).toBe(2);

    const post2 = await posts.insert({
        revisionUserId: user.id,
        userId: user.id,
        title: 'Foo',
    });

    expect(await revisions.count()).toBe(2);
    expect(await post.revisions.count()).toBe(2);
    expect(await post2.revisions.count()).toBe(0);

    const post3 = await posts.insert({
        revisionUserId: user.id,
        userId: user.id,
        title: 'Foo',
        body: 'Apple',
    });

    expect(await revisions.count()).toBe(3);
    expect(await post.revisions.count()).toBe(2);
    expect(await post2.revisions.count()).toBe(0);
    expect(await post3.revisions.count()).toBe(1);
}));

