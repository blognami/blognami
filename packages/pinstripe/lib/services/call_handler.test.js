import test from 'node:test';
import assert from 'node:assert';

import callHandler from './call_handler.js';

const handleCall = (pathname, responseHeaders = { 'content-type': 'text/html' }) => {
    const context = {};
    const self = {
        context,
        get params(){ return context.params; },
        normalizeParams: callHandler.normalizeParams,
        normalizeResponse: callHandler.normalizeResponse,
        render: async () => [200, responseHeaders, ['body']]
    };
    return callHandler.handleCall.call(self, { _url: pathname, _method: 'get' }, true);
};

test("handleCall - a _-prefixed first segment gets x-robots-tag: noindex", async () => {
    const [ , headers ] = await handleCall('/_actions/guest/sign_in');
    assert.equal(headers['x-robots-tag'], 'noindex');
});

test("handleCall - the root path does not get x-robots-tag", async () => {
    const [ , headers ] = await handleCall('/');
    assert.equal(headers['x-robots-tag'], undefined);
});

test("handleCall - a mid-segment underscore does not get x-robots-tag", async () => {
    const [ , headers ] = await handleCall('/posts/my_post');
    assert.equal(headers['x-robots-tag'], undefined);
});

test("handleCall - a nested _-prefixed segment gets x-robots-tag: noindex", async () => {
    const [ , headers ] = await handleCall('/foo/_bar');
    assert.equal(headers['x-robots-tag'], 'noindex');
});

test("handleCall - a _-prefixed path keeps an explicitly set x-robots-tag", async () => {
    const [ , headers ] = await handleCall('/_actions/guest/sign_in', { 'content-type': 'text/html', 'x-robots-tag': 'index, follow' });
    assert.equal(headers['x-robots-tag'], 'index, follow');
});

test("handleCall - a _-prefixed path with no header still defaults to noindex", async () => {
    const [ , headers ] = await handleCall('/_actions/guest/sign_in');
    assert.equal(headers['x-robots-tag'], 'noindex');
});
