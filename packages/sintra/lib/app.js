
import { Class } from './class.js';
import { ImportableRegistry } from './importable_registry.js';
import { ServiceConsumer } from './service_consumer.js';;
import { View } from "./view.js";

export const App = Class.extend().include({
    meta(){
        this.assignProps({ name: 'App' });

        this.include(ImportableRegistry);
        this.include(ServiceConsumer);
    },

    renderView(name, params = {}){
        const mappedName = this.viewMap[name];
        if(!mappedName) return;
        return View.render(this.context, mappedName, params);
    },

    get viewMap(){
        if(!this._viewMap){
            const namespaces = this.compose();
            const cacheKey = `viewMap:${JSON.stringify(namespaces)}`;
            if(!View.cache[cacheKey]){
                View.cache[cacheKey] = this.createViewMap(namespaces);
            }
            this._viewMap = View.cache[cacheKey];
        }
        return this._viewMap;
    },

    createViewMap(namespaces = []){
        const out = {}
        
        namespaces.forEach(namespace => {
            View.names.forEach(name => {
                const pattern = new RegExp(`^${namespace}/(.*)$`);
                const matches = name.match(pattern);
                if(!matches) return;
                out[matches[1]] = name;
            })
        });

        for(let viewName of Object.keys(out)){
            if(viewName.endsWith('/index')){
                const overrideName = viewName.replace(/\/index$/, '');
                out[overrideName] ??= out[viewName];
            }
        }
        
        return out;
    },

    compose(){
        return ['shared', this.constructor.name];
    },

    async render(){
        const viewName = this.params._url.pathname.replace(/^\/|\/$/g, '') || 'index';
        
        let out = await this.renderGuardViews(viewName, this.params);
        if(out) return out;

        if(!viewName.match(/(^|\/)_[^\/]+(|\/index)$/)){
            out = await this.renderView(viewName, this.params);
            if(out) return out;
        }
        
        return this.renderDefaultViews(viewName, this.params);
    },

    async renderGuardViews(viewName, params){
        const viewNameSegments = viewName != '' ? viewName.split(/\//) : [];

        const prefixSegments = [];
        while(true){
            const candidateGuardViewName = prefixSegments.length ? [...prefixSegments, 'guard'].join('/') : 'guard';
            const out = await this.renderView(candidateGuardViewName, params);
            if(out) return out;
            if(viewNameSegments.length == 0) break;
            prefixSegments.push(viewNameSegments.shift());
        }
    },

    async renderDefaultViews(viewName, params){
        const prefixSegments = viewName != '' ? viewName.split(/\//) : [];
        while(true){
            const candidateDefaultViewName = prefixSegments.length ? [...prefixSegments, 'default'].join('/') : 'default';
            const out = await this.renderView(candidateDefaultViewName, params);
            if(out) return out;
            if(prefixSegments.length == 0) break;
            prefixSegments.pop();
        }
    }
});
