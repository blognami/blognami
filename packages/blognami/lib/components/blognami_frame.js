
import { loadCache } from "./helpers.js";

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
            this._url = new URL(
                this.params.url || window.location,
                this.frame ? this.frame.url : window.location
            );
        }
        return this._url;
    },

    set url(url){
        this._url = new URL(
            url,
            this.url
        );
    },

    loading: false,

    async load(url = this.url, options = {}){
        if(this.loading) return;
        this.loading = true;
        this.abort();
        const { method = 'GET', placeholderUrl } = options;
        const cachedHtml = method == 'GET' ? loadCache.get(url.toString()) : undefined;
        const out = cachedHtml ? this.patch(cachedHtml) : undefined;
        let minimumDelay = 0;
        if(!cachedHtml && placeholderUrl){
            const placeholderHtml = loadCache.get(placeholderUrl.toString());
            if(placeholderHtml) {
                this.patch(placeholderHtml);
                minimumDelay = 300;
            }
        }
        this.url = url;
        const response = await this.fetch(url, { minimumDelay, ...options });
        const html = await response.text();
        this.loading = false;
        if(html == cachedHtml) return out;
        if(method == 'GET') loadCache.put(url.toString(), html);
        this.patch(html);
    }
};
