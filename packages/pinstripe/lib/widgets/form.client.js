
import { defineWidget } from 'pinstripe';
import { is } from 'ramda';

import { Url } from '../url.js';

defineWidget('form', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        let isAutosubmit = false;

        this.on('submit', (event) => {
            event.preventDefault();
            this.frame.load({ _method: this.method, _url: this.url, ...this.params }, isAutosubmit);
        })

        this.setTimeout(() => {
            isAutosubmit = this.attributes['data-autosubmit'] == true || this.descendants.filter(node => node.is('input[type=submit], button[type=submit]')).length == 0
            if(isAutosubmit){
                let hash = JSON.stringify(this.params);
                this.setInterval(() => {
                    const newHash = JSON.stringify(this.params);
                    if(hash != newHash){
                        hash = newHash;
                        this.trigger('submit');
                    }
                }, 100);
            }
        })
    },

    get method(){
        return this.attributes['method'] || this.attributes['data-method'] || 'GET';
    },

    get url(){
        if(this._url === undefined){
            this._url = Url.fromString(
                this.attributes['action'] || this.attributes['data-url'] || this.frame.url,
                this.frame.url
            )
        }
        return this._url;
    },

    get inputs(){
        return this.descendants.filter((descendant) => descendant.isInput);
    },

    get params(){
        const out = {}
        this.inputs.forEach(input => {
            const value = input.value
            if(value !== undefined){
                out[input.name] = value
            }
        })
        return out;
    }
});
