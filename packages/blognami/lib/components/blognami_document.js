
import { loadCache, normalizeUrl } from "./helpers.js";

const preloading = {};

export default {
    meta(){
        this.include('blognami-frame');

        this.prototype.assignProps({
            get meta(){
                const out = {};
                this.head.findAll('meta').forEach(({ params }) => {
                    const { name, content } = params;
                    if(name) out[name] = content;
                });
                return out;
            }
        })
    },

    initialize(...args){    
        this.constructor.for('blognami-frame').prototype.initialize.call(this, ...args);

        window.onpopstate = (event) => {
            this.load(event.state || window.location, { replace: true });
        };
    },

    isDocument: true,

    get head(){
        if(!this._head){
            this._head = this.find('head');
        }
        return this._head;
    },
    
    get body(){
        if(!this._body){
            this._body = this.find('body');
        }
        return this._body;
    },

    get progressBar(){
        return this.body.progressBar;
    },

    async load(url = this.url.toString(), options = {}){
        const { replace, method = 'GET' } = options;
        const previousUrl = this.url.toString();
        const normalizedUrl = normalizeUrl(url, previousUrl).toString();

        if(method == 'GET' && previousUrl != normalizedUrl){
            if(replace){
                history.replaceState(normalizedUrl, null, normalizedUrl);
            } else {
                history.pushState(normalizedUrl, null, normalizedUrl);
                window.scrollTo(0, 0);
            }
        }

        return this.constructor.for('blognami-frame').prototype.load.call(this, url, options);
    },

    async preload(url){
        if(loadCache.get(url.toString())) return;
        if(preloading[url.toString()]) return;
        preloading[url.toString()] = true;
        const response = await fetch(url);
        const html = await response.text();
        loadCache.put(url.toString(), html);
        delete preloading[url.toString()];
    }
};
