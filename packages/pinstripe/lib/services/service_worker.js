
import { MarkupNode } from 'haberdash/lib/markup_node.js';

import { MissingResourceError } from '../missing_resource_error.js';

// How long (ms) to trust a single /_pinstripe/_shell/version.json identity +
// kill-epoch check before re-fetching, so the guard can run on every request
// (not just navigations) without hitting the network per request.
const APP_CHECK_TTL = 5000;

const MARKUP_NODE_TYPE = 'application/vnd.pinstripe.markup-node+json';

export default {
    meta(){
        this.addToClient();
    },
    
    create(){
        return this;
    },

    start(){
        addEventListener("install", (event) => {
            event.waitUntil(skipWaiting());
        });

        addEventListener('activate', (event) => {
            event.waitUntil(clients.claim());
        });
    
        addEventListener("fetch", (event) => {
            if(!this.shouldHandleFetch(event)) return;
            event.respondWith(this.handleFetch(event));
        });

        this.version.then(version => {
            console.log(`Worker started. Running version ${JSON.stringify(version)}.`);
        });
    },

    shouldHandleFetch(event){
        const { request } = event;
        if(new URL(request.url).origin !== self.location.origin) return false;
        if(request.mode === 'no-cors') return false;
        if(request.headers.has('range')) return false;
        return true;
    },

    async handleFetch(event){
        // Escape hatch: our own reserved ?_disableServiceWorker flag force-clears a
        // wedged worker — unregister this worker and pass the request straight through
        // to the network instead of routing it. initialize.js skips re-registration on
        // the same load so a fresh worker isn't immediately recreated.
        if(new URL(event.request.url, 'http://127.0.0.1').searchParams.has('_disableServiceWorker')){
            await self.registration.unregister();
            return fetch(event.request);
        }

        const now = Date.now();
        if(!this._appCheck || now - this._appCheck.at >= APP_CHECK_TTL){
            this._appCheck = {
                at: now,
                isApp: fetch('/_pinstripe/_shell/version.json', { cache: 'no-store' })
                    .then(async response => {
                        if(!response.ok) return false;
                        const { minWorkerVersion } = await response.json().catch(() => ({}));
                        return !((await this.version) < minWorkerVersion);
                    })
                    .catch(() => !navigator.onLine)
            };
        }

        if(!(await this._appCheck.isApp)){
            await self.registration.unregister();
            return fetch(event.request);
        }

        const request1 = event.request.clone();
        const request2 = event.request.clone();

        try {
            const params = await this.extractParams(request1);
            const [ status, headers, body ] = await this.callHandler.handleCall(params);
            if(status >= 200 && status < 300){
                const bodyText = Array.isArray(body) ? body.join('') : String(body);
                return this.parseAndSerializeIfHtml(new Response(bodyText, { status, headers }), event.request);
            }
            return this.parseAndSerializeIfHtml(await fetch(request2), event.request);
        } catch (error) {
            if(!(error instanceof MissingResourceError)) console.log(error);
            return this.parseAndSerializeIfHtml(await fetch(request2), event.request);
        }
    },

    // When a request opts into the markup-node type via Accept, re-emit any
    // text/html response — whether rendered locally or fetched from the network as
    // a fallback, and whatever its status — as a serialized MarkupNode, so the
    // window never has to parse HTML. The status is preserved, so an html error
    // page still arrives as the right status, just pre-parsed.
    async parseAndSerializeIfHtml(response, request){
        if(!(request.headers?.get('Accept') ?? '').includes(MARKUP_NODE_TYPE)) return response;
        if(!(response.headers.get('content-type') ?? '').includes('text/html')) return response;
        const node = await new MarkupNode().appendHtml(await response.text());
        const headers = new Headers(response.headers);
        headers.set('content-type', MARKUP_NODE_TYPE);
        headers.delete('content-length');
        headers.delete('content-encoding');
        return new Response(node.serialize(), { status: response.status, statusText: response.statusText, headers });
    },

    async extractParams(request){
        return {
            ...(await this.extractUrlParams(request)),
            ...(await this.extractBodyParams(request)),
            _method: request.method,
            _url: this.extractUrl(request),
            _headers: this.extractHeaders(request)
        };
    },

    extractUrl(request){
        return new URL(request.url, 'http://127.0.0.1');
    },

    extractUrlParams(request){
        const out = {};
        this.extractUrl(request).searchParams.forEach((value, key) => {
            out[key] = value;
        });
        return out;
    },

    extractHeaders(request){
        const out = {};
        for(let [key, value] of request.headers){
            out[key] = value;
        }
        return out;
    },

    async extractBodyParams(request){
        if(!request.method.match(/^POST|PUT|PATCH$/)) return {};
        const contentType = request.headers.get('content-type') ?? '';
        if(contentType == 'application/json') return request.json();
        const out = {};
        try {
            if(contentType.match(/^multipart\/form-data/)){
                const formData = await request.formData();
                for(let [key, value] of formData){
                    out[key] = value;
                }
            }
        } catch (error){}
        return out;
    }
};
