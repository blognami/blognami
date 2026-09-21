import test from 'node:test';
import assert from 'node:assert';

import server from './server.js';

const baseUrl = new URL('http://127.0.0.1:3000/');

const extractParams = headers => server.extractParams.call({}, { method: 'GET', url: '/sitemap.xml', headers }, baseUrl, {});

test("extractParams - a loopback host keeps the listener's protocol", async () => {
    assert.equal((await extractParams({ host: 'localhost:3000' }))._url.origin, 'http://localhost:3000');
    assert.equal((await extractParams({ host: '127.0.0.1:3000' }))._url.origin, 'http://127.0.0.1:3000');
});

test("extractParams - a non-loopback host without x-forwarded-proto assumes https", async () => {
    assert.equal((await extractParams({ host: 'example.com' }))._url.origin, 'https://example.com');
});

test("extractParams - x-forwarded-proto is trusted when present", async () => {
    assert.equal((await extractParams({ host: 'example.com', 'x-forwarded-proto': 'http' }))._url.origin, 'http://example.com');
});

test("extractParams - x-forwarded-host and x-forwarded-proto set the origin", async () => {
    const { _url } = await extractParams({ host: '10.0.0.5:3000', 'x-forwarded-host': 'blog.example.com', 'x-forwarded-proto': 'https' });
    assert.equal(_url.origin, 'https://blog.example.com');
});
