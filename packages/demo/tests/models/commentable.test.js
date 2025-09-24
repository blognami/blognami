
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`commentable`, () => Workspace.run(async _ => {
    const { users, commentables, comments, posts } = _.database;

    assert.equal(await commentables.count(), 0);

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

    assert.equal(await commentables.count(), 1);

    await comments.insert({
        userId: user.id,
        commentableId: post.id,
        body: 'Comment 1'
    });

    assert.equal(await commentables.count(), 2);
    assert.equal(await post.comments.count(), 1);

    const comment = await post.comments.first();
    assert.equal(comment.body, 'Comment 1');
    assert.equal(await comment.commentable.id, post.id);
    assert.equal(await comment.rootCommentable.id, post.id);

    const subComment = await comments.insert({
        userId: user.id,
        commentableId: comment.id,
        body: 'Comment 1.1'
    });

    assert.equal(await commentables.count(), 3);
    assert.equal(await post.comments.count(), 1);
    assert.equal(await post.comments.comments.count(), 1);
    assert.equal(await subComment.commentable.id, comment.id);
    assert.equal(await subComment.rootCommentable.id, post.id);

    await post.update({
        enableComments: false
    });

    await assert.rejects(async () => {
        await comments.insert({
            userId: user.id,
            commentableId: comment.id,
            body: 'Comment 1.2'
        });  
    }, { message: JSON.stringify({ general: 'Comments have not been enabled.' })});

    assert.equal(await commentables.count(), 3);

    await post.update({
        enableComments: true
    });

    await comments.insert({
        userId: user.id,
        commentableId: comment.id,
        body: 'Comment 1.2'
    });

    assert.equal(await commentables.count(), 4);

    await post.delete();

    assert.equal(await commentables.count(), 0);

}));
