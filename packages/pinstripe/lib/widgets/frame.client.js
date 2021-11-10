
import { Url } from '../url.js';
import { DEFAULT_WIDGETS } from '../constants.js';

export default {

    meta(){
        this.parent.prototype.assignProps({
            isFrame: false,

            get frame(){
                return this.parents.find(({ isFrame }) => isFrame);
            }
        });
    },

    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        this.addVirtualNodeFilter(function(){
            this.traverse(normalizeVirtualNode)
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
        const progressBar = (this.document || this).progressBar;
        
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
    if(!this.parent && this.children.some(child => child.type == 'html')){
        this.children = [
            new this.constructor(this, '#doctype'),
            ...this.children.filter(child => child.type == 'html')
        ];
    }

    if(this.type == 'head'){
        const style = new this.constructor(this, 'style', {'data-widget': 'document/style'})
        this.children = [
            style,
            ...this.children
        ];
    }

    if(this.type == 'body'){
        const progressBar = new this.constructor(this, 'div', {'data-widget': 'document/progress-bar'})
        this.children = [
            progressBar,
            ...this.children
        ];
        progressBar.appendNode('div');
    }

    if(this.type == '#text'){
        this.attributes.value = this.attributes.value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }

    if(this.type == 'form' && this.attributes.autocomplete === undefined){
        this.attributes.autocomplete = 'off';
    }

    if(this.parent && this.parent.type == 'textarea' && this.type == '#text'){
        this.attributes.value = this.attributes.value.replace(/^\n/, '');
    }

    if(!this.attributes['data-widget']){
        const widget = DEFAULT_WIDGETS[this.type];
        if(widget){
            this.attributes['data-widget'] = widget;
        }
    }
}