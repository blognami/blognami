


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

});

afterEach(() => environment.resetEnvironment());
