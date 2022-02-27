

import 'demo';
import { createEnvironment } from 'pinstripe';

let environment;

beforeEach(async () => {
    environment = await createEnvironment();
    await environment.runCommand('reset-database');
});

test(`post`, async () => {
    const { users, posts } = environment;

    expect(await posts.count()).toBe(0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'secret',
        role: 'admin'
    });

    const { id } = await posts.insert({
        userId: user.id,
        title: 'Foo'
    });

    expect(await posts.count()).toBe(1);

    let post = await posts.idEq(id).first();

    expect(post.title).toBe('Foo');

    expect(await post.user.name).toBe('Admin');

    await post.update({ title: 'Bar' });

    post = await posts.idEq(id).first();

    expect(post.title).toBe('Bar');

    await post.delete();

    expect(await posts.count()).toBe(0);
});

afterEach(() => environment.resetEnvironment());