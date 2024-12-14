

import { View } from '../view.js';

export const client =  true;

export default {
    create(){
        const cacheKey = 'viewMap';
        if(!View.cache[cacheKey]){
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

            View.cache[cacheKey] = out;
        }
        return View.cache[cacheKey];
    }
};