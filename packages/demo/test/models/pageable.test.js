


import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`pageable`, () => Workspace.run(async _ => {
    const { pageables, users, posts } = _.database;

    expect(await pageables.count()).toBe(0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    expect(await pageables.count()).toBe(1);

    const post = await posts.insert({
        userId: user.id,
        title: 'Foo'
    });

    expect(await pageables.count()).toBe(2);

    await post.update({ tags: 'Foo\nBar'});

    expect(await pageables.count()).toBe(4);

}));
