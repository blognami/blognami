


import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`tagable`, () => Workspace.run(async _ => {
    const { users, tagables, posts } = _.database;

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
    expect(await tagables.where({ taggedWith: 'Apple' }).count()).toBe(1);
    expect(await tagables.where({ taggedWith: 'Pear' }).count()).toBe(1);
    expect(await tagables.where({ taggedWith: 'Peach' }).count()).toBe(0);
    expect(await tagables.where({ taggedWith: ['Apple', 'Pear'] }).count()).toBe(1);
    expect(await tagables.where({ taggedWith: ['Apple', 'Peach'] }).count()).toBe(0);

    let tagable = await tagables.where({ id }).first();

    expect(tagable.title).toBe('Foo');
    expect(await tagable.tags.count()).toBe(2);

    await tagable.update({
        tags: `
            Apple
            Peach
        `
    });
    expect(await tagable.tags.count()).toBe(2);
    expect(await tagables.where({ taggedWith: 'Apple' }).count()).toBe(1);
    expect(await tagables.where({ taggedWith: 'Pear' }).count()).toBe(0);
    expect(await tagables.where({ taggedWith: 'Peach' }).count()).toBe(1);
    expect(await tagables.where({ taggedWith: ['Apple', 'Pear'] }).count()).toBe(0);
    expect(await tagables.where({ taggedWith: ['Apple', 'Peach'] }).count()).toBe(1);

    await tagable.update({
        tags: ''
    });
    expect(await tagable.tags.count()).toBe(0);
    expect(await tagables.where({ taggedWith: 'Apple' }).count()).toBe(0);
    expect(await tagables.where({ taggedWith: 'Pear' }).count()).toBe(0);
    expect(await tagables.where({ taggedWith: 'Peach' }).count()).toBe(0);
    expect(await tagables.where({ taggedWith: ['Apple', 'Pear'] }).count()).toBe(0);
    expect(await tagables.where({ taggedWith: ['Apple', 'Peach'] }).count()).toBe(0);
}));
