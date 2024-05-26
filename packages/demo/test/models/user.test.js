
import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`user`, () => Workspace.run(async _ => {
    const { users, posts, tags, tagableTags } = _.database;

    expect(await users.count()).toBe(0);

    const { id: userId } = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    expect(await users.count()).toBe(1);

    const user = await users.where({ id: userId }).first();

    expect(user.name).toBe('Admin');

    expect(await user.posts.count()).toBe(0);

    expect(await user.posts.tags.count()).toBe(0);

    await posts.insert({ userId, title: 'Foo' });

    expect(await user.posts.count()).toBe(1);

    expect(await user.posts.tags.count()).toBe(0);

    const { id: postId } = await posts.insert({ userId, title: 'Foo' });

    expect(await user.posts.count()).toBe(2);

    const appleTag = await tags.insert({ name: 'Apple' });
    const pearTag = await tags.insert({ name: 'Pear' });
    const peachTag = await tags.insert({ name: 'Peach' });

    await tagableTags.insert({ tagId: appleTag.id, tagableId: postId });

    expect(await user.posts.tags.count()).toBe(1);

    const { id: postId2 } = await posts.insert({ userId, title: 'Foo' });


    await tagableTags.insert({ tagId: appleTag.id, tagableId: postId2 });
    await tagableTags.insert({ tagId: pearTag.id, tagableId: postId2 });
    await tagableTags.insert({ tagId: peachTag.id, tagableId: postId2 });

    expect(await user.posts.count()).toBe(3);

    expect(await user.posts.tags.count()).toBe(3);

    expect(await tagableTags.count()).toBe(4);

    await user.posts.delete();

    expect(await tagableTags.count()).toBe(0);
}));
