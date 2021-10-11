
import { defineWidget } from 'pinstripe';

// should be root (and attached to top html tag)?
defineWidget('document', {
    meta(){
        this.include('frame');

        this.parent.prototype.assignProps({
            isDocument: false,

            get document(){
                return this.parents.find(({ isDocument }) => isDocument);
            }
        });
    },

    isDocument: true,

    initialize(...args){
        this.constructor.classes.frame.prototype.initialize.call(this, ...args);

        window.onpopstate = (event) => {
            this.load({ _url: event.state || window.location }, true);
        };
        window._nodeWrapper = this;
    },

    get progressBar(){
        if(!this._progressBar){
            this._progressBar = this.descendants.find(node => node.is('*[data-widget="document/progress-bar"]'));
        }
        return this._progressBar;
    },

    load(params = {}, replace = false){
        const previousUrl = this.url.toString();
        this.constructor.classes.frame.prototype.load.call(this, params);
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

