
import { Component } from "../component.js";
import { MarkupNode } from "../markup_node.js";
import { loadCache, normalizeUrl, HTML_FRAME_ACCEPT_HEADER } from "./helpers.js";

Component.register('pinstripe-frame', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        let { loadOnInit } = this.params;
        if(loadOnInit == undefined) {
            loadOnInit = this.children.length == 0;
        } else {
            loadOnInit = loadOnInit == 'true';
        }
        
        if(loadOnInit) this.on('init', () => this.load());
    },

    isFrame: true,
        
    get url(){
        if(this._url === undefined){
            this._url = normalizeUrl(
                this.params.url || window.location,
                this.frame ? this.frame.url : window.location
            );
        }
        return this._url;
    },

    set url(url){
        this._url = normalizeUrl(
            url,
            this.url
        );
    },

    status: 'complete',

    async load(url = this.url, options = {}){
        this._pendingResponse?.destroy();
        const { progressBar } = this.document;
        progressBar.start();
        await clearEventLoop();
        this.status = 'loading';
        this.url = url;
        const { method = 'GET', headers = {}, placeholderUrl, useCache = this.params.useCache == 'true', skipPatch = this.params.skipPatch == 'true' } = options;
        const normalizedHeaders = headers instanceof Headers ? headers : new Headers(headers);
        if(!normalizedHeaders.has('Accept')) normalizedHeaders.set('Accept', HTML_FRAME_ACCEPT_HEADER);
        const acceptHeader = normalizedHeaders.get('Accept');
        const isHtmlRequest = acceptHeader.match(/text\/html|\*\/\*|application\/vnd\.pinstripe\.markup-node\+json/i);
        const cachedMarkup = method == 'GET' && isHtmlRequest ? loadCache.get(`${this.document.loadCacheNamespace}:${url}`) : undefined;
        if(cachedMarkup) {
            if(useCache){
                this.status = 'complete';
                if(!skipPatch) this.patch(MarkupNode.deserialize(cachedMarkup));
                await clearEventLoop();
                progressBar.stop();
                return;
            }
            this.status = 'using-cached-html';
            if(!skipPatch) this.patch(MarkupNode.deserialize(cachedMarkup));
        }
        let minimumDelay = 0;
        if(!cachedMarkup && placeholderUrl && isHtmlRequest) {
            const placeholderMarkup = loadCache.get(`${this.document.loadCacheNamespace}:${placeholderUrl}`);
            if(placeholderMarkup) {
                this.status = 'using-placeholder-html';
                if(!skipPatch) this.patch(MarkupNode.deserialize(placeholderMarkup));
                minimumDelay = 300;
            }
        }
        try {
            this._pendingResponse = this.fetch(this.url, { minimumDelay, ...options, headers: normalizedHeaders });
            const response = await this._pendingResponse;
            const contentTypeHeader = response.headers.get('Content-Type') || '';
            let body;
            if(contentTypeHeader.match(/application\/vnd\.pinstripe\.markup-node\+json/i)) {
                const serialized = await response.text();
                const node = MarkupNode.deserialize(serialized);
                this.status = 'complete';
                if(!skipPatch) this.patch(node);
                if(serialized != cachedMarkup && method == 'GET') loadCache.put(`${this.document.loadCacheNamespace}:${this.url}`, serialized);
                body = node;
            } else if(contentTypeHeader.match(/text\/html/i)) {
                const html = await response.text();
                const node = new MarkupNode().appendHtml(html);
                const serialized = node.serialize();
                this.status = 'complete';
                if(!skipPatch) this.patch(node);
                if(serialized != cachedMarkup && method == 'GET') loadCache.put(`${this.document.loadCacheNamespace}:${this.url}`, serialized);
                body = html;
            } else if(contentTypeHeader.match(/application\/json/i)){
                body = await response.json();
                this.status = 'complete';
            } else {
                body = await response.text();
                this.status = 'complete';
            }
            this.trigger('load',  { bubbles: false, data: { status: response.status, headers: response.headers, body, patched: !skipPatch } });
        } catch(e) {
            if(e != 'Request aborted') console.log(e);
        }
        await clearEventLoop();
        progressBar.stop();
    }
});

const clearEventLoop = () => new Promise(resolve => setTimeout(resolve, 0));