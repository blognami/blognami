
import { Component } from "../component.js";

Component.register('pinstripe-frame', {
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

        this.url = url;

        const { headers = {}, ...otherOptions } = options;
        const response = await this.fetch(url, Object.assign({
            headers: Object.assign({
                'x-pinstripe-frame-type': 'basic'
            }, headers)
        }, otherOptions));

        return this.patch(await response.text());
    }
});
