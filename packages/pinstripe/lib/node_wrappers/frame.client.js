
import { Url } from '../url.js';

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        
        const { loadOnInit = this.children.length == 0 } = this.data;

        if(loadOnInit){
            this.on('init', () => this.load());
        }

        this.addVirtualNodeFilter(function(){
            this.traverse(normalizeVirtualNode);
        });
    },

    isFrame: true,

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

        _headers = { ..._headers };
        _headers['x-pinstripe-frame-type'] = _headers['x-pinstripe-frame-type'] || 'basic';

        this.abort();

        _method = _method.toUpperCase();
        
        this.url = _url;
        const isRequestBody = _method == 'POST' || _method == 'PUT' || _method == 'PATCH';
        if(!isRequestBody){
            this.url.params = {...this.url.params, ...params};
        }

        this._request = new XMLHttpRequest();

        this._request.open(_method, this.url.toString(), true);

        Object.keys(_headers).forEach(name => {
            this._request.setRequestHeader(name, _headers[name]);
        });

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
    if(this.attributes['data-node-wrapper']) return;

    if(this.type == 'form'){
        this.attributes['data-node-wrapper'] = 'form';
        return;
    }

    if(this.type == 'a'){
        this.attributes['data-node-wrapper'] = 'anchor';
        return;
    }
}