
import { Frame } from './frame.client.js';

Frame.register('document').include({
    meta(){
        this.assignProps({
            selector(){
                return this.type == '#document';
            }
        });
    },

    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        window.onpopstate = (event) => {
            this.load({ _url: event.state || window.location }, true);
        };
        window._nodeWrapper = this;
    },

    get progressBar(){
        if(!this._progressBar){
            this._progressBar = this.find('#p-progress-bar').pop()
        }
        return this._progressBar;
    },

    load(params = {}, replace = false){
        const previousUrl = this.url.toString();
        this.constructor.parent.prototype.load.call(this, params);
        if(params._method == 'GET' && previousUrl != this.url.toString()){
            if(replace){
                history.replaceState(this.url.toString(), null, this.url.toString());
            } else {
                history.pushState(this.url.toString(), null, this.url.toString());
                window.scrollTo(0, 0);
            }
        }
    }
});

