
import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`commentable`, () => Workspace.run(async _ => {
    const { users, commentables, comments, posts } = _.database;

    expect(await commentables.count()).toBe(0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const post = await posts.insert({
        userId: user.id,
        title: 'Foo',
        enableComments: true
    });

    expect(await commentables.count()).toBe(1);

    await comments.insert({
        userId: user.id,
        commentableId: post.id,
        body: 'Comment 1'
    });

    expect(await commentables.count()).toBe(2);
    expect(await post.comments.count()).toBe(1);

    const comment = await post.comments.first();
    expect(comment.body).toBe('Comment 1');
    expect(await comment.commentable.id).toBe(post.id);
    expect(await comment.rootCommentable.id).toBe(post.id);

    const subComment = await comments.insert({
        userId: user.id,
        commentableId: comment.id,
        body: 'Comment 1.1'
    });

    expect(await commentables.count()).toBe(3);
    expect(await post.comments.count()).toBe(1);
    expect(await post.comments.comments.count()).toBe(1);
    expect(await subComment.commentable.id).toBe(comment.id);
    expect(await subComment.rootCommentable.id).toBe(post.id);

    await post.update({
        enableComments: false
    });

    await expect(async () => {
        await comments.insert({
            userId: user.id,
            commentableId: comment.id,
            body: 'Comment 1.2'
        });  
    }).rejects.toThrow(JSON.stringify({ general: 'Comments have not been enabled.' }))

    expect(await commentables.count()).toBe(3);

    await post.update({
        enableComments: true
    });

    await comments.insert({
        userId: user.id,
        commentableId: comment.id,
        body: 'Comment 1.2'
    });

    expect(await commentables.count()).toBe(4);

    await post.delete();

    expect(await commentables.count()).toBe(0);

}));
