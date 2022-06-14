


import 'demo';
import { createEnvironment } from 'pinstripe';

let environment;

beforeEach(async () => {
    environment = await createEnvironment();
    await environment.runCommand('reset-database');
});

test(`tagable`, async () => {
    const { users, tagables, posts } = environment;

    expect(await tagables.count()).toBe(0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const { id } = await posts.insert({
        userId: user.id,
        title: 'Foo',
        tags: `
            Apple
            Pear
        `
    });

    expect(await tagables.count()).toBe(1);
    expect(await tagables.taggedWith('Apple').count()).toBe(1);
    expect(await tagables.taggedWith('Pear').count()).toBe(1);
    expect(await tagables.taggedWith('Peach').count()).toBe(0);
    expect(await tagables.taggedWith('Apple', 'Pear').count()).toBe(1);
    expect(await tagables.taggedWith('Apple', 'Peach').count()).toBe(0);

    let tagable = await tagables.idEq(id).first();

    expect(tagable.title).toBe('Foo');
    expect(await tagable.tags.count()).toBe(2);

    await tagable.update({
        tags: `
            Apple
            Peach
        `
    });
    expect(await tagable.tags.count()).toBe(2);
    expect(await tagables.taggedWith('Apple').count()).toBe(1);
    expect(await tagables.taggedWith('Pear').count()).toBe(0);
    expect(await tagables.taggedWith('Peach').count()).toBe(1);
    expect(await tagables.taggedWith('Apple', 'Pear').count()).toBe(0);
    expect(await tagables.taggedWith('Apple', 'Peach').count()).toBe(1);

    await tagable.update({
        tags: ''
    });
    expect(await tagable.tags.count()).toBe(0);
    expect(await tagables.taggedWith('Apple').count()).toBe(0);
    expect(await tagables.taggedWith('Pear').count()).toBe(0);
    expect(await tagables.taggedWith('Peach').count()).toBe(0);
    expect(await tagables.taggedWith('Apple', 'Pear').count()).toBe(0);
    expect(await tagables.taggedWith('Apple', 'Peach').count()).toBe(0);
});

afterEach(() => environment.resetEnvironment());