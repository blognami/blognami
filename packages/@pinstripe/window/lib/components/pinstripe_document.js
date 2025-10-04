
import { Component } from "../component.js";
import { loadCache, normalizeUrl } from "./helpers.js";

const preloading = {};

Component.register('pinstripe-document', {
    meta(){
        this.include('pinstripe-frame');

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
        this.constructor.for('pinstripe-frame').prototype.initialize.call(this, ...args);

        window.onpopstate = (event) => {
            this.load(event.state || window.location, { replace: true });
        };

        this.lastChange = Date.now();
        this.setInterval(() => {
            if(!this.progressBar) return;
            const now = Date.now();
            if(this.progressBar.startCount > 0) {
                this.logChange();
            } else if(now - this.lastChange > 500) {
                this.html.addClass('idle');
            }
        }, 100);
    },

    logChange(){
        this.lastChange = Date.now();
        this.html.removeClass('idle');
    },

    isDocument: true,

    get html(){
        if(!this._html){
            this._html = this.find('html');
        }
        return this._html;
    },

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
        return this.body?.progressBar;
    },

    get loadCacheNamespace(){
        return this.head.find('meta[name="pinstripe-load-cache-namespace"]')?.params.content ?? 'default';
    },

    get globalStyles(){
        if(!this._globalStyles){
            try {
                this._globalStyles = mergeCssStylesheets(this.node.styleSheets ?? []);
            } catch (e) {
                this._globalStyles = undefined;
            }
        }
        return this._globalStyles;
    },

    get componentBase(){
        return this.head.find('meta[name="pinstripe-component-base"]')?.params.content;
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

        await this.constructor.for('pinstripe-frame').prototype.load.call(this, url, options);

        if(!this.url.hash) return;

        const targetElement = this.document.find(this.url.hash);
        if(!targetElement) return;

        let scrollY = targetElement.node.getBoundingClientRect().top + window.scrollY;

        const scrollTopElementId = this.document.head.find('meta[name="pinstripe-scroll-top-element-id"]')?.params.content || 'pinstripe-scroll-top';
        const scrollTopElement = this.document.find(`#${scrollTopElementId}`);
        if(scrollTopElement){
            scrollY -= scrollTopElement.node.getBoundingClientRect().bottom + 10;
        }
    
        window.scrollTo(0, scrollY);
    },

    async preload(url){
        if(loadCache.get(`${this.document.loadCacheNamespace}:${url}`)) return;
        if(preloading[url.toString()]) return;
        preloading[url.toString()] = true;
        const response = await fetch(url);
        const html = await response.text();
        loadCache.put(`${this.document.loadCacheNamespace}:${url}`, html);
        delete preloading[url.toString()];
    }
});


export function mergeCssStylesheets(stylesheets, out = new CSSStyleSheet()) {
    for(const sheet of stylesheets){
        try {
            for(const rule of sheet.cssRules) {
                if(rule instanceof CSSImportRule) {
                    mergeCssStylesheets([ rule.styleSheet ], out);
                } else {
                    out.insertRule(rule.cssText);
                }
            }
        } catch (e) {
            // Ignore errors from stylesheets that cannot be merged
        }
    }
    return out;
}