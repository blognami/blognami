


import 'demo';
import { createEnvironment } from 'pinstripe';

let environment;

beforeEach(async () => {
    environment = await createEnvironment();
    await environment.runCommand('reset-database');
});

test(`pageable`, async () => {
    const { pageables, users, posts } = environment;

    expect(await pageables.count()).toBe(0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'secret',
        role: 'admin'
    });

    const post = await posts.insert({
        userId: user.id,
        title: 'Foo'
    });

    expect(await pageables.count()).toBe(1);

    await post.update({ tags: 'Foo\nBar'});

    expect(await pageables.count()).toBe(3);

});

afterEach(() => environment.resetEnvironment());
