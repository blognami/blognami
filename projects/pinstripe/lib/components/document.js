
import { whenever } from "../node_wrapper.js";

whenever('pinstripe-document', function(){
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
            const normalizedUrl = new URL(url, previousUrl).toString();
    
            if(method == 'GET' && previousUrl != normalizedUrl){
                if(replace){
                    history.replaceState(normalizedUrl, null, normalizedUrl);
                } else {
                    history.pushState(normalizedUrl, null, normalizedUrl);
                    window.scrollTo(0, 0);
                }
            }
    
            return load.call(this, url, Object.assign({
                method,
                headers: Object.assign({
                    'x-pinstripe-frame-type': 'document'
                }, headers)
            }, otherOptions));
        }
    });
});

whenever('#document', function(){
    this.apply('pinstripe-document');
});
