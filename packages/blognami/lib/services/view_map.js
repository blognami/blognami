

import { View } from 'pinstripe';

export const client =  true;

export default {
    async create(){
        const cacheKey = `viewMap:${await this.theme}`;
        if(!View.cache[cacheKey]){
            const out = {}

            for(let viewName of View.names){
                out[viewName] = viewName;
            }

            for(let viewName of Object.keys(out)){
                const pattern = new RegExp(`^(|.+\/)_themes\/${await this.theme}\/(.*)$`);
                const match = viewName.match(pattern);
                if(!match) continue;
                const overrideName = `${match[1]}${match[2]}`;
                out[overrideName] = viewName;
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