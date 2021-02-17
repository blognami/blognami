import { Frame } from './frame.js';

export class Document extends Frame {

    static get name(){ return 'document' }
    
    static get selector(){ return function(){ return this.type == '#document' } }

    constructor(...args){
        super(...args)
        window.onpopstate = (event) => {
            this.load({ _url: event.state || window.location }, true)
        }
        window._nodeWrapper = this
    }

    get progressBar(){
        if(!this._progressBar){
            this._progressBar = this.find('#p-progress-bar').pop()
        }
        return this._progressBar;
    }

    load(params = {}, replace = false){
        const previousUrl = this.url.toString()
        super.load(params)
        if(params._method == 'GET' && previousUrl != this.url.toString()){
            if(replace){
                history.replaceState(this.url.toString(), null, this.url.toString());
            } else {
                history.pushState(this.url.toString(), null, this.url.toString());
                window.scrollTo(0, 0);
            }
        }
    }

}

Document.register()
