
import { loadCache } from "./helpers.js";

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        let { loadOnInit } = this.data;
        if(loadOnInit == undefined) loadOnInit = this.children.length == 0;
        
        if(loadOnInit){
            this.on('init', () => this.load());
        }
    },

    isFrame: true,
        
    get url(){
        if(this._url === undefined){
            this._url = new URL(
                this.attributes['data-url'] || window.location,
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

    async load(url = this.url, options = {}){
        this.abort();

        const { method = 'GET', preload = false } = options

        const cachedHtml = method == 'GET' ? loadCache.get(url.toString()) : undefined;

        const out = cachedHtml && !preload ? this.patch(cachedHtml) : undefined;

        if(!preload) this.url = url;

        const { headers = {}, ...otherOptions } = options;
        const response = await this.fetch(url, Object.assign({
            headers: Object.assign({
                'x-pinstripe-frame-type': 'basic'
            }, headers)
        }, otherOptions));

        const html = await response.text();

        if(html == cachedHtml) return out;

        if(method == 'GET') loadCache.put(url.toString(), html);

        if(!preload) return this.patch(html);
    }
};
