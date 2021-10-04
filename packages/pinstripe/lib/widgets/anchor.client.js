
import { defineWidget } from 'pinstripe';

import { Url } from '../url.js';

defineWidget('anchor', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        this.on('click', (event) => {
            if(this.url.host == this.frame.url.host && this.url.port == this.frame.url.port){
                event.preventDefault();

                const confirm = this.attributes['data-confirm'];
                const method = this.attributes['data-method'] || 'GET';
                const target = this.attributes['target'] || this.attributes['data-target'] || '_top';

                if(!confirm || window.confirm(confirm)){
                    if(target == '_overlay'){
                        this.document.find('html').pop().addClass('p-clip');
                        this.document.find('body').pop().append(`<div data-widget="overlay" data-url="${this.url}"></div>`).forEach((overlay) => {
                            overlay._parent = this;
                            overlay.load();
                        })
                    } else {
                        this.frame.load({ _method: method, _url: this.url });
                    }
                }
            }
        });
    },

    get url(){
        if(this._url === undefined){
            this._url = Url.fromString(
                this.attributes['href'] || this.attributes['data-url'],
                this.frame.url
            );
        }
        return this._url;
    },

    set url(url){
        this._url = Url.fromString(
            url,
            this.url
        );
    }
});
