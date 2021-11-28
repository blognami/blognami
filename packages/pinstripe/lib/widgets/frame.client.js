
import { Url } from '../url.js';

export default {

    meta(){
        this.parent.prototype.assignProps({
            isFrame: false,

            get frame(){
                return this.parents.find(({ isFrame }) => isFrame);
            }
        });
    },

    isFrame: true,

    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        this.addVirtualNodeFilter(function(){
            this.traverse(normalizeVirtualNode);
        });
    },

    get url(){
        if(this._url === undefined){
            this._url = Url.fromString(
                this.attributes['data-url'] || window.location,
                this.frame ? this.frame.url : window.location
            );
        }
        return this._url;
    },

    set url(url){
        this._url = Url.fromString(
            url,
            this.url
        );
    },

    load(arg1 = {}){
        const { progressBar } = this.document;
        
        let { _method = 'GET', _url = this.url.toString(), _headers = {}, ...params } = arg1;

        this.abort();

        _method = _method.toUpperCase();
        
        this.url = _url;
        const isRequestBody = _method == 'POST' || _method == 'PUT' || _method == 'PATCH';
        if(!isRequestBody){
            this.url.params = {...this.url.params, ...params};
        }

        this._request = new XMLHttpRequest();

        this._request.open(_method, this.url.toString(), true);

        progressBar.start();

        this._request.onload = () => {
            if (this._request.status >= 200 && this._request.status < 500) {
                this.patch(this._request.response);
                this.abort();
            }
        }

        this._request.onerror = () => this.abort();

        const formData = new FormData();
        if(isRequestBody){
            Object.keys(params).forEach((name) => formData.append(name, params[name]));
        }
        
        this._request.send(formData);
    },

    abort(){
        const progressBar = (this.document || this).progressBar;
        if(this._request){
            this._request.abort();
            delete this._request;
            progressBar.stop();
        }
    }
};

function normalizeVirtualNode(){
    if(this.attributes['data-widget']) return;

    if(this.type == 'form'){
        this.attributes['data-widget'] = 'trigger';
        if(!this.attributes['data-event']) this.attributes['data-event'] = 'submit';
        const { method, action } = this.attributes;
        if(!this.attributes['data-method'] && method) this.attributes['data-method'] = this.attributes.method;
        if(!this.attributes['data-url'] && action) this.attributes['data-url'] = this.attributes.action;
        return;
    }

    const isClickable = this.type == 'a' || (this.type == 'button' && this.attributes.type != 'submit') || (this.type == 'input' && this.attributes.type == 'button');
    if(isClickable){
        this.attributes['data-widget'] = 'trigger';
        if(!this.attributes['data-event']) this.attributes['data-event'] = 'click';
        if(!this.attributes['data-action']) this.attributes['data-action'] = 'load';
        const { target, href } = this.attributes;
        if(!this.attributes['data-target'] && target) this.attributes['data-target'] = this.attributes.target;
        if(!this.attributes['data-url'] && href) this.attributes['data-url'] = this.attributes.href;
        return;
    }

    if(this.attributes['data-action']){
        this.attributes['data-widget'] = 'trigger';
    }
}