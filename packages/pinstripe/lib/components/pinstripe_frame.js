
import { loadCache, normalizeUrl } from "./helpers.js";

export default {
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

    loading: false,

    async load(url = this.url, options = {}){
        this.abort();
        const { progressBar } = this.document;
        progressBar.start();
        await new Promise(resolve => setTimeout(resolve, 0)); // make sure the event loop is clear
        this.loading = true;
        this.url = url;
        const { method = 'GET', placeholderUrl } = options;
        const cachedHtml = method == 'GET' ? loadCache.get(`${this.document.loadCacheNamespace}:${url}`) : undefined;
        if(cachedHtml) this.patch(cachedHtml);
        let minimumDelay = 0;
        if(!cachedHtml && placeholderUrl){
            const placeholderHtml = loadCache.get(`${this.document.loadCacheNamespace}:${placeholderUrl}`);
            if(placeholderHtml) {
                this.patch(placeholderHtml);
                minimumDelay = 300;
            }
        }
        try {
            const response = await this.fetch(this.url, { minimumDelay, ...options });
            const html = await response.text();
            this.loading = false;
            if(html != cachedHtml){
                this.patch(html);
                if(method == 'GET') loadCache.put(`${this.document.loadCacheNamespace}:${this.url}`, html);
            }
        } catch(e) {
            this.loading = false;
        }
        progressBar.stop();
    }
};
