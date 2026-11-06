import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

const SITE_URL = 'http://localhost/';

beforeEach(reset);

const RENDER_PARAMS = {
    _method: 'GET',
    _url: new URL(SITE_URL),
    _headers: {}
};

const titlesIn = html => [...html.matchAll(/<title>([^<]*)<\/title>/g)].map(match => match[1]);

const render = async function(name, params){
    const out = await this.renderView(name, { ...RENDER_PARAMS, ...params });
    const [status, , body] = Array.isArray(out) ? out : out.toResponseArray();
    return { status, titles: titlesIn(body.join('')) };
};

test('_layout renders a title param as the only title', () => Workspace.run(async function() {
    const { titles } = await render.call(this, '_layout', { title: 'Layout Title', body: 'Hello' });

    assert.deepEqual(titles, ['Layout Title']);
}));

test('_layout lets a meta title win over a title param', () => Workspace.run(async function() {
    const { titles } = await render.call(this, '_layout', { title: 'Layout Title', meta: [{ title: 'Meta Title' }], body: 'Hello' });

    assert.deepEqual(titles, ['Meta Title']);
}));

test('_404 renders a Not found title', () => Workspace.run(async function() {
    const { status, titles } = await render.call(this, '_404', {});

    assert.equal(status, 404);
    assert.deepEqual(titles, ['Not found']);
}));

test('_shell falls back to the site title when no view supplies one', () => Workspace.run(async function() {
    await this.database.site.update({ title: 'Site Title' });

    const { titles } = await render.call(this, '_blognami/_shell', { body: 'Hello' });

    assert.deepEqual(titles, ['Site Title']);
}));

test('_shell falls back to the hostname when the site title is blank', () => Workspace.run(async function() {
    await this.database.site.update({ title: '  ' });
    Object.assign(this.initialParams, { _url: new URL(SITE_URL) });

    const { titles } = await render.call(this, '_blognami/_shell', { body: 'Hello' });

    assert.deepEqual(titles, ['localhost']);
}));

test('_shell keeps an explicit meta title over the fallback', () => Workspace.run(async function() {
    await this.database.site.update({ title: 'Site Title' });

    const { titles } = await render.call(this, '_blognami/_shell', { meta: [{ title: 'Meta Title' }], body: 'Hello' });

    assert.deepEqual(titles, ['Meta Title']);
}));
