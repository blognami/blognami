
import { Component } from "../component.js";
import { loadCache, normalizeUrl } from "./helpers.js";

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
        const acceptHeader = normalizedHeaders.get('Accept') || '*/*';
        const isHtmlRequest = acceptHeader.match(/text\/html|\*\/\*/i);
        const cachedHtml = method == 'GET' && isHtmlRequest ? loadCache.get(`${this.document.loadCacheNamespace}:${url}`) : undefined;
        if(cachedHtml) {
            if(useCache){
                this.status = 'complete';
                if(!skipPatch) this.patch(cachedHtml);
                await clearEventLoop();
                progressBar.stop();
                return;
            }
            this.status = 'using-cached-html';
            if(!skipPatch) this.patch(cachedHtml);
        }
        let minimumDelay = 0;
        if(!cachedHtml && placeholderUrl && isHtmlRequest) {
            const placeholderHtml = loadCache.get(`${this.document.loadCacheNamespace}:${placeholderUrl}`);
            if(placeholderHtml) {
                this.status = 'using-placeholder-html';
                if(!skipPatch) this.patch(placeholderHtml);
                minimumDelay = 300;
            }
        }
        try {
            this._pendingResponse = this.fetch(this.url, { minimumDelay, ...options });
            const response = await this._pendingResponse;
            const contentTypeHeader = response.headers.get('Content-Type') || '';
            let body;
            if(contentTypeHeader.match(/text\/html/i)) {
                const html = await response.text();
                this.status = 'complete';
                if(!skipPatch) this.patch(html);
                if(html != cachedHtml && method == 'GET') loadCache.put(`${this.document.loadCacheNamespace}:${this.url}`, html);
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