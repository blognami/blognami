
import { View } from '../view.js';

export const client = true;

export default {
    create(){
        return async (name, params = {}) => {
            const mappedName = this.viewMap[name];
            if(!mappedName) return;
            return View.render(this.context, mappedName, params);
        }
    },

    get viewMap(){
        const cacheKey = 'viewMap';
        if(!View.cache[cacheKey]){
            View.cache[cacheKey] = this.createViewMap();
        }
        return View.cache[cacheKey];
    },

    createViewMap(){
        const out = {}

        for(let viewName of View.names){
            out[viewName] = viewName;
        }

        for(let viewName of Object.keys(out)){
            if(viewName.endsWith('/index')){
                const overrideName = viewName.replace(/\/index$/, '');
                out[overrideName] ??= viewName;
            }
        }
        
        return out;
    }
};
