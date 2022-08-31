
import { defineDecorator } from "../node_wrapper.js";

defineDecorator('pinstripe-frame', function (){

    const { loadOnInit = this.children.length == 0 } = this.data;
    
    if(loadOnInit){
        this.on('init', () => this.load());
    }

    this.assignProps({
        isFrame: true,
    
        get url(){
            if(this._url === undefined){
                this._url = new URL(
                    this.attributes['data-url'] || window.location,
                    this.frame ? this.frame.url : window.location
                );
            }
            return this._url;
        },
    
        set url(url){
            this._url = new URL(
                url,
                this.url
            );
        },
    
        async load(url = this.url, options = {}){
            this.abort();
            const { headers = {}, ...otherOptions } = options;
            const response = await this.fetch(url, Object.assign({
                headers: Object.assign({
                    'x-pinstripe-frame-type': 'basic'
                }, headers)
            }, otherOptions));
    
            this.url = url;
    
            return this.patch(await response.text());
        }
    })
});
