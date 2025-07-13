
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
        const { method = 'GET', placeholderUrl, useCache = this.params.useCache == 'true' } = options;
        const cachedHtml = method == 'GET' ? loadCache.get(`${this.document.loadCacheNamespace}:${url}`) : undefined;
        if(cachedHtml) {
            if(useCache){
                this.status = 'complete';
                this.patch(cachedHtml);
                await clearEventLoop();
                progressBar.stop();
                return;
            }
            this.status = 'using-cached-html';
            this.patch(cachedHtml);
        }
        let minimumDelay = 0;
        if(!cachedHtml && placeholderUrl){
            const placeholderHtml = loadCache.get(`${this.document.loadCacheNamespace}:${placeholderUrl}`);
            if(placeholderHtml) {
                this.status = 'using-placeholder-html';
                this.patch(placeholderHtml);
                minimumDelay = 300;
            }
        }
        try {
            this._pendingResponse = this.fetch(this.url, { minimumDelay, ...options });

            const response = await this._pendingResponse;
            
            const html = await response.text();
            this.status = 'complete';
            this.patch(html);
            if(html != cachedHtml && method == 'GET') loadCache.put(`${this.document.loadCacheNamespace}:${this.url}`, html);
        } catch(e) {
            if(e != 'Request aborted') console.log(e);
        }
        await clearEventLoop();
        progressBar.stop();
    }
});

const clearEventLoop = () => new Promise(resolve => setTimeout(resolve, 0));