

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`post`, () => Workspace.run(async _ => {
    const { users, posts } = _.database;

    expect(await posts.count()).toBe(0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const { id } = await posts.insert({
        userId: user.id,
        title: 'Foo'
    });

    expect(await posts.count()).toBe(1);

    let post = await posts.where({ id }).first();

    expect(post.title).toBe('Foo');


    expect(await post.user.name).toBe('Admin');

    await post.update({ title: 'Bar' });

    post = await posts.where({ id }).first();

    expect(post.title).toBe('Bar');

    await post.delete();

    expect(await posts.count()).toBe(0);
}));
