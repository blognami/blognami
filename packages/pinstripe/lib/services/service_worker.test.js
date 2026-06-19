import test from 'node:test';
import assert from 'node:assert';

import serviceWorker from './service_worker.js';
import { MissingResourceError } from '../missing_resource_error.js';
import { MarkupNode } from 'haberdash/lib/markup_node.js';

// Build a handleFetch `this` from the real service plus per-test overrides, so
// methods handleFetch calls on itself (e.g. parseAndSerializeIfHtml) are present.
const handlerContext = (overrides) => ({ ...serviceWorker, ...overrides });

const withStubbedGlobals = async (fn) => {
    const originalFetch = globalThis.fetch;
    const originalLog = console.log;
    const networkResponse = new Response('from network', { status: 200 });
    const logged = [];
    globalThis.fetch = async () => networkResponse;
    console.log = (...args) => logged.push(args);
    try {
        return await fn({ networkResponse, logged });
    } finally {
        globalThis.fetch = originalFetch;
        console.log = originalLog;
    }
};

const fetchEvent = (handleCall) => ({
    request: { mode: 'cors', clone(){ return this; } },
    context: handlerContext({
        extractParams: async () => ({}),
        callHandler: { handleCall }
    })
});

const origin = 'https://app.test';

const withStubbedLocation = (fn) => {
    const originalSelf = globalThis.self;
    globalThis.self = { location: { origin } };
    try {
        return fn();
    } finally {
        globalThis.self = originalSelf;
    }
};

const shouldHandleEvent = ({ url = `${origin}/posts`, mode = 'cors', range = false } = {}) => ({
    request: { url, mode, headers: new Headers(range ? { range: 'bytes=0-' } : {}) }
});

test("handleFetch - a non-MissingResourceError in handleCall fails open to the network and is logged", async () => {
    await withStubbedGlobals(async ({ networkResponse, logged }) => {
        const error = new Error('boom');
        const { request, context } = fetchEvent(async () => { throw error; });

        const response = await serviceWorker.handleFetch.call(context, { request });

        assert.equal(response, networkResponse);
        assert.ok(logged.some(args => args.includes(error)));
    });
});

test("handleFetch - a MissingResourceError in handleCall falls back to the network without logging", async () => {
    await withStubbedGlobals(async ({ networkResponse, logged }) => {
        const { request, context } = fetchEvent(async () => { throw new MissingResourceError(); });

        const response = await serviceWorker.handleFetch.call(context, { request });

        assert.equal(response, networkResponse);
        assert.equal(logged.length, 0);
    });
});

test("shouldHandleFetch - a cross-origin request is not handled", () => {
    withStubbedLocation(() => {
        const event = shouldHandleEvent({ url: 'https://cdn.other.test/font.woff2' });
        assert.equal(serviceWorker.shouldHandleFetch(event), false);
    });
});

test("shouldHandleFetch - an opaque (no-cors) request is not handled", () => {
    withStubbedLocation(() => {
        const event = shouldHandleEvent({ mode: 'no-cors' });
        assert.equal(serviceWorker.shouldHandleFetch(event), false);
    });
});

test("shouldHandleFetch - a range request is not handled", () => {
    withStubbedLocation(() => {
        const event = shouldHandleEvent({ range: true });
        assert.equal(serviceWorker.shouldHandleFetch(event), false);
    });
});

test("shouldHandleFetch - a routable same-origin request is handled", () => {
    withStubbedLocation(() => {
        const event = shouldHandleEvent();
        assert.equal(serviceWorker.shouldHandleFetch(event), true);
    });
});

const versionJsonUrl = '/_pinstripe/_shell/version.json';

const withWorkerGlobals = async (versionResponse, fn) => {
    const originalFetch = globalThis.fetch;
    const originalSelf = globalThis.self;
    const originalLog = console.log;
    const networkResponse = new Response('from network', { status: 200 });
    let unregisters = 0;
    globalThis.fetch = async (resource) => {
        const url = typeof resource === 'string' ? resource : resource?.url;
        if(url === versionJsonUrl) return versionResponse();
        return networkResponse;
    };
    globalThis.self = { location: { origin }, registration: { unregister: async () => { unregisters++; } } };
    console.log = () => {};
    try {
        return await fn({ networkResponse, unregisters: () => unregisters });
    } finally {
        globalThis.fetch = originalFetch;
        globalThis.self = originalSelf;
        console.log = originalLog;
    }
};

test("handleFetch - a non-OK version.json while online unregisters and passes through (navigation)", async () => {
    await withWorkerGlobals(() => new Response('gone', { status: 404 }), async ({ networkResponse, unregisters }) => {
        const response = await serviceWorker.handleFetch.call({ version: '0.1.0' }, { request: { mode: 'navigate' } });
        assert.equal(response, networkResponse);
        assert.equal(unregisters(), 1);
    });
});

test("handleFetch - a non-OK version.json while online unregisters and passes through (non-navigation)", async () => {
    await withWorkerGlobals(() => new Response('gone', { status: 404 }), async ({ networkResponse, unregisters }) => {
        const response = await serviceWorker.handleFetch.call({ version: '0.1.0' }, { request: { mode: 'cors' } });
        assert.equal(response, networkResponse);
        assert.equal(unregisters(), 1);
    });
});

test("handleFetch - a minWorkerVersion above this.version unregisters the worker", async () => {
    const versionResponse = () => new Response(JSON.stringify({ version: '0.2.0', minWorkerVersion: '0.2.0' }), { status: 200 });
    await withWorkerGlobals(versionResponse, async ({ networkResponse, unregisters }) => {
        const response = await serviceWorker.handleFetch.call({ version: '0.1.0' }, { request: { mode: 'cors' } });
        assert.equal(response, networkResponse);
        assert.equal(unregisters(), 1);
    });
});

test("handleFetch - a version at or above minWorkerVersion keeps the worker and serves the app", async () => {
    const versionResponse = () => new Response(JSON.stringify({ version: '0.2.0', minWorkerVersion: '0.1.0' }), { status: 200 });
    await withWorkerGlobals(versionResponse, async ({ unregisters }) => {
        const context = handlerContext({
            version: '0.2.0',
            extractParams: async () => ({}),
            callHandler: { handleCall: async () => [200, {}, 'shell'] }
        });
        const response = await serviceWorker.handleFetch.call(context, { request: { mode: 'navigate', clone(){ return this; } } });
        assert.equal(unregisters(), 0);
        assert.equal(await response.text(), 'shell');
    });
});

const MARKUP_TYPE = 'application/vnd.pinstripe.markup-node+json';

const okVersionResponse = () => new Response(JSON.stringify({ version: '0.2.0', minWorkerVersion: '0.1.0' }), { status: 200 });

const htmlFrameRequest = (accept) => ({
    mode: 'navigate',
    headers: new Headers(accept ? { Accept: accept } : {}),
    clone(){ return this; }
});

const handlingContext = (handleCall) => handlerContext({
    version: '0.2.0',
    extractParams: async () => ({}),
    callHandler: { handleCall: async () => handleCall }
});

test("handleFetch - a 2xx text/html response is serialized when Accept carries the markup type", async () => {
    await withWorkerGlobals(okVersionResponse, async () => {
        const context = handlingContext([200, { 'content-type': 'text/html' }, ['<p>hi</p>']]);
        const response = await serviceWorker.handleFetch.call(context, {
            request: htmlFrameRequest(`text/html, ${MARKUP_TYPE}`)
        });
        assert.equal(response.headers.get('content-type'), MARKUP_TYPE);
        const node = MarkupNode.deserialize(await response.text());
        assert.equal(node.toString(), '<p>hi</p>');
    });
});

test("handleFetch - a 2xx text/html response passes through unchanged when Accept omits the markup type", async () => {
    await withWorkerGlobals(okVersionResponse, async () => {
        const context = handlingContext([200, { 'content-type': 'text/html' }, ['<p>hi</p>']]);
        const response = await serviceWorker.handleFetch.call(context, {
            request: htmlFrameRequest('text/html')
        });
        assert.equal(response.headers.get('content-type'), 'text/html');
        assert.equal(await response.text(), '<p>hi</p>');
    });
});

test("handleFetch - a 2xx non-text/html response passes through unchanged even when Accept carries the markup type", async () => {
    await withWorkerGlobals(okVersionResponse, async () => {
        const context = handlingContext([200, { 'content-type': 'application/json' }, ['{"a":1}']]);
        const response = await serviceWorker.handleFetch.call(context, {
            request: htmlFrameRequest(`text/html, ${MARKUP_TYPE}`)
        });
        assert.equal(response.headers.get('content-type'), 'application/json');
        assert.equal(await response.text(), '{"a":1}');
    });
});

const withFallbackNetwork = async (fallbackResponse, fn) => {
    const originalFetch = globalThis.fetch;
    const originalSelf = globalThis.self;
    const originalLog = console.log;
    globalThis.fetch = async (resource) => {
        const url = typeof resource === 'string' ? resource : resource?.url;
        if(url === versionJsonUrl) return okVersionResponse();
        return fallbackResponse();
    };
    globalThis.self = { location: { origin }, registration: { unregister: async () => {} } };
    console.log = () => {};
    try {
        return await fn();
    } finally {
        globalThis.fetch = originalFetch;
        globalThis.self = originalSelf;
        console.log = originalLog;
    }
};

const htmlNetworkResponse = () => new Response('<p>net</p>', { status: 200, headers: { 'content-type': 'text/html' } });

test("handleFetch - a MissingResourceError fallback serializes the network html when Accept carries the markup type", async () => {
    await withFallbackNetwork(htmlNetworkResponse, async () => {
        const context = handlerContext({
            version: '0.2.0',
            extractParams: async () => ({}),
            callHandler: { handleCall: async () => { throw new MissingResourceError(); } }
        });
        const response = await serviceWorker.handleFetch.call(context, {
            request: htmlFrameRequest(`text/html, ${MARKUP_TYPE}`)
        });
        assert.equal(response.headers.get('content-type'), MARKUP_TYPE);
        const node = MarkupNode.deserialize(await response.text());
        assert.equal(node.toString(), '<p>net</p>');
    });
});

test("handleFetch - a MissingResourceError fallback passes the network html through unchanged when Accept omits the markup type", async () => {
    await withFallbackNetwork(htmlNetworkResponse, async () => {
        const context = handlerContext({
            version: '0.2.0',
            extractParams: async () => ({}),
            callHandler: { handleCall: async () => { throw new MissingResourceError(); } }
        });
        const response = await serviceWorker.handleFetch.call(context, {
            request: htmlFrameRequest('text/html')
        });
        assert.equal(response.headers.get('content-type'), 'text/html');
        assert.equal(await response.text(), '<p>net</p>');
    });
});

test("handleFetch - a non-2xx handleCall result falls back to the network and serializes it for the markup type", async () => {
    await withFallbackNetwork(htmlNetworkResponse, async () => {
        const context = handlingContext([404, { 'content-type': 'text/html' }, ['nope']]);
        const response = await serviceWorker.handleFetch.call(context, {
            request: htmlFrameRequest(`text/html, ${MARKUP_TYPE}`)
        });
        assert.equal(response.headers.get('content-type'), MARKUP_TYPE);
        const node = MarkupNode.deserialize(await response.text());
        assert.equal(node.toString(), '<p>net</p>');
    });
});

test("handleFetch - a non-2xx network html fallback is still serialized with its status preserved", async () => {
    await withFallbackNetwork(
        () => new Response('<p>missing</p>', { status: 404, headers: { 'content-type': 'text/html' } }),
        async () => {
            const context = handlerContext({
                version: '0.2.0',
                extractParams: async () => ({}),
                callHandler: { handleCall: async () => { throw new MissingResourceError(); } }
            });
            const response = await serviceWorker.handleFetch.call(context, {
                request: htmlFrameRequest(`text/html, ${MARKUP_TYPE}`)
            });
            assert.equal(response.status, 404);
            assert.equal(response.headers.get('content-type'), MARKUP_TYPE);
            const node = MarkupNode.deserialize(await response.text());
            assert.equal(node.toString(), '<p>missing</p>');
        }
    );
});
