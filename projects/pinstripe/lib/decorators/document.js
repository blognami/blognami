
import { defineDecorator } from "../node_wrapper.js";

defineDecorator('pinstripe-document', function(){
    this.apply('pinstripe-frame');

    window.onpopstate = (event) => {
        this.load(event.state || window.location, { replace: true });
    };

    const { load } = this;

    this.assignProps({
        isDocument: true,

        get body(){
            if(!this._body){
                this._body = this.find('body');
            }
            return this._body;
        },
    
        get progressBar(){
            return this.body.progressBar;
        },
    
        async load(url, options = {}){
            const { replace, method = 'GET', headers = {}, ...otherOptions } = options;
            const previousUrl = this.url.toString();
    
            const out = await load.call(this, url, Object.assign({
                method,
                headers: Object.assign({
                    'x-pinstripe-frame-type': 'document'
                }, headers)
            }, otherOptions));
    
            if(method == 'GET' && previousUrl != this.url.toString()){
                if(replace){
                    history.replaceState(this.url.toString(), null, this.url.toString());
                } else {
                    history.pushState(this.url.toString(), null, this.url.toString());
                    window.scrollTo(0, 0);
                }
            }
    
            return out;
        }
    });
});

defineDecorator('#document', function(){
    this.apply('pinstripe-document');
});
