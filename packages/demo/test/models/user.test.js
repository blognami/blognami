


import 'demo';
import { createEnvironment } from 'pinstripe';

let environment;

beforeEach(async () => {
    environment = await createEnvironment();
    await environment.runCommand('reset-database');
});

test(`user`, async () => {
    const { users, posts, tagableTags } = environment;

    expect(await users.count()).toBe(0);

    const { id } = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    expect(await users.count()).toBe(1);

    const user = await users.idEq(id).first();

    expect(user.name).toBe('Admin');

    expect(await user.posts.count()).toBe(0);

    expect(await user.posts.tags.count()).toBe(0);

    await posts.insert({ userId: id, title: 'Foo' });

    expect(await user.posts.count()).toBe(1);

    expect(await user.posts.tags.count()).toBe(0);

    await posts.insert({ userId: id, title: 'Foo', tags: 'Apple' });

    expect(await user.posts.count()).toBe(2);

    expect(await user.posts.tags.count()).toBe(1);

    await posts.insert({ userId: id, title: 'Foo', tags: 'Apple\nPear\nPeach' });

    expect(await user.posts.count()).toBe(3);

    expect(await user.posts.tags.count()).toBe(3);

    expect(await tagableTags.count()).toBe(4);

    await user.posts.delete();

    expect(await tagableTags.count()).toBe(0);
});

afterEach(() => environment.resetEnvironment());