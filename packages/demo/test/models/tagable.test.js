
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`tagable`, () => Workspace.run(async _ => {
    const { users, tagables, posts, tags, tagableTags } = _.database;

    assert.equal(await tagables.count(), 0);

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

    assert.equal(await tagables.count(), 1);
    assert.equal(await tagables.where({ tags: { name:  'Apple' } }).count(), 1);
    assert.equal(await tagables.where({ tags: { name:  'Pear' } }).count(), 1);
    assert.equal(await tagables.where({ tags: { name:  'Peach' } }).count(), 0);
    assert.equal(await tagables.where({ tags: { name:  'Apple' } }).where({ tags: { name: 'Pear' } }).count(), 1);
    assert.equal(await tagables.where({ tags: { name:  'Apple' } }).where({ tags: { name: 'Peach' } }).count(), 0);

    let tagable = await tagables.where({ id: post.id }).first();

    assert.equal(tagable.title, 'Foo');
    assert.equal(await tagable.tags.count(), 2);

    await tagable.tagableTags.delete();
    await tagableTags.insert({ tagId: appleTag.id, tagableId: tagable.id });
    await tagableTags.insert({ tagId: peachTag.id, tagableId: tagable.id });
    
    assert.equal(await tagable.tags.count(), 2);
    assert.equal(await tagables.where({ tags: { name:  'Apple' } }).count(), 1);
    assert.equal(await tagables.where({ tags: { name:  'Pear' } }).count(), 0);
    assert.equal(await tagables.where({ tags: { name:  'Peach' } }).count(), 1);
    assert.equal(await tagables.where({ tags: { name:  'Apple' } }).where({ tags: { name: 'Pear' } }).count(), 0);
    assert.equal(await tagables.where({ tags: { name:  'Apple' } }).where({ tags: { name: 'Peach' } }).count(), 1);

    await tagable.tagableTags.delete();
    assert.equal(await tagable.tags.count(), 0);
    assert.equal(await tagables.where({ tags: { name:  'Apple' } }).count(), 0);
    assert.equal(await tagables.where({ tags: { name:  'Pear' } }).count(), 0);
    assert.equal(await tagables.where({ tags: { name:  'Peach' } }).count(), 0);
    assert.equal(await tagables.where({ tags: { name:  'Apple' } }).where({ tags: { name: 'Pear' } }).count(), 0);
    assert.equal(await tagables.where({ tags: { name:  'Apple' } }).where({ tags: { name: 'Peach' } }).count(), 0);
}));
