


import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`tagable`, () => Workspace.run(async _ => {
    const { users, tagables, posts, tags, tagableTags } = _.database;

    expect(await tagables.count()).toBe(0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const appleTag = await tags.insert({ name: 'Apple' });
    const pearTag = await tags.insert({ name: 'Pear' });
    const peachTag = await tags.insert({ name: 'Peach' });

    const post = await posts.insert({
        userId: user.id,
        title: 'Foo'
    });

    await tagableTags.insert({ tagId: appleTag.id, tagableId: post.id });
    await tagableTags.insert({ tagId: pearTag.id, tagableId: post.id });

    expect(await tagables.count()).toBe(1);
    expect(await tagables.where({ tags: { name:  'Apple' } }).count()).toBe(1);
    expect(await tagables.where({ tags: { name:  'Pear' } }).count()).toBe(1);
    expect(await tagables.where({ tags: { name:  'Peach' } }).count()).toBe(0);
    expect(await tagables.where({ tags: { name:  'Apple' } }).where({ tags: { name: 'Pear' } }).count()).toBe(1);
    expect(await tagables.where({ tags: { name:  'Apple' } }).where({ tags: { name: 'Peach' } }).count()).toBe(0);

    let tagable = await tagables.where({ id: post.id }).first();

    expect(tagable.title).toBe('Foo');
    expect(await tagable.tags.count()).toBe(2);

    await tagable.tagableTags.delete();
    await tagableTags.insert({ tagId: appleTag.id, tagableId: tagable.id });
    await tagableTags.insert({ tagId: peachTag.id, tagableId: tagable.id });
    
    expect(await tagable.tags.count()).toBe(2);
    expect(await tagables.where({ tags: { name:  'Apple' } }).count()).toBe(1);
    expect(await tagables.where({ tags: { name:  'Pear' } }).count()).toBe(0);
    expect(await tagables.where({ tags: { name:  'Peach' } }).count()).toBe(1);
    expect(await tagables.where({ tags: { name:  'Apple' } }).where({ tags: { name: 'Pear' } }).count()).toBe(0);
    expect(await tagables.where({ tags: { name:  'Apple' } }).where({ tags: { name: 'Peach' } }).count()).toBe(1);

    await tagable.tagableTags.delete();
    expect(await tagable.tags.count()).toBe(0);
    expect(await tagables.where({ tags: { name:  'Apple' } }).count()).toBe(0);
    expect(await tagables.where({ tags: { name:  'Pear' } }).count()).toBe(0);
    expect(await tagables.where({ tags: { name:  'Peach' } }).count()).toBe(0);
    expect(await tagables.where({ tags: { name:  'Apple' } }).where({ tags: { name: 'Pear' } }).count()).toBe(0);
    expect(await tagables.where({ tags: { name:  'Apple' } }).where({ tags: { name: 'Peach' } }).count()).toBe(0);
}));
