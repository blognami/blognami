
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`pageable`, () => Workspace.run(async _ => {
    const { pageables, users, posts, tag } = _.database;

    assert.equal(await pageables.count(), 0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    assert.equal(await pageables.count(), 1);

    const post = await posts.insert({
        userId: user.id,
        title: 'Foo'
    });

    assert.equal(await pageables.count(), 2);
}));

test(`candidate slug skips view name collision`, () => Workspace.run(async _ => {
    const { users, posts } = _.database;

    const originalViewMap = await _.viewMap;
    _.serviceManager.intercept('viewMap', () => ({ ...originalViewMap, about: 'about' }));

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const post = await posts.insert({
        userId: user.id,
        title: 'About'
    });

    assert.equal(post.slug, 'about-2');
}));

test(`candidate slug is unaffected when no view collision`, () => Workspace.run(async _ => {
    const { users, posts } = _.database;

    const originalViewMap = await _.viewMap;
    _.serviceManager.intercept('viewMap', () => ({ ...originalViewMap, about: 'about' }));

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const post = await posts.insert({
        userId: user.id,
        title: 'My Great Post'
    });

    assert.equal(post.slug, 'my-great-post');
}));

test(`synthetic viewMap entry causes slug fallthrough`, () => Workspace.run(async _ => {
    const { users, posts } = _.database;

    const originalViewMap = await _.viewMap;
    _.serviceManager.intercept('viewMap', () => ({ ...originalViewMap, widgets: 'widgets' }));

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const post = await posts.insert({
        userId: user.id,
        title: 'Widgets'
    });

    assert.equal(post.slug, 'widgets-2');
}));

test(`explicit slug colliding with viewMap is rejected`, () => Workspace.run(async _ => {
    const { users, posts } = _.database;

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const originalViewMap = await _.viewMap;
    _.serviceManager.intercept('viewMap', () => ({ ...originalViewMap, about: 'about' }));

    try {
        await posts.insert({
            userId: user.id,
            title: 'Test Post',
            slug: 'about'
        });
        assert.fail('Expected a validation error');
    } catch(e) {
        assert.equal(e.errors.slug, 'Reserved by a built-in page');
    }
}));

test(`explicit slug not in viewMap passes validation`, () => Workspace.run(async _ => {
    const { users, posts } = _.database;

    const originalViewMap = await _.viewMap;
    _.serviceManager.intercept('viewMap', () => ({ ...originalViewMap, about: 'about' }));

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const post = await posts.insert({
        userId: user.id,
        title: 'Test Post',
        slug: 'about-thoughts'
    });

    assert.equal(post.validationErrors.slug, undefined);
    assert.equal(post.slug, 'about-thoughts');
}));

test(`existing pageable with colliding slug can be re-saved unchanged`, () => Workspace.run(async _ => {
    const { users, posts } = _.database;

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const post = await posts.insert({
        userId: user.id,
        title: 'About'
    });

    assert.equal(post.slug, 'about');

    const originalViewMap = await _.viewMap;
    _.serviceManager.intercept('viewMap', () => ({ ...originalViewMap, about: 'about' }));

    await post.update({ title: 'About Us' });

    assert.equal(post.validationErrors.slug, undefined);
    assert.equal(post.slug, 'about');
}));
