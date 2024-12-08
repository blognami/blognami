
import { View } from '../view.js';

export const client = true;

export default {
    create(){
        return (name, params = {}) => {
            const viewMap = this.viewMapFor(['portal']);
            console.log(`viewMap ${JSON.stringify(viewMap, null, 2)}`);
            const mappedName = viewMap[name];
            if(!mappedName) return;
            return View.render(this.context, mappedName, params);
        }
    },

    viewMapFor(variants){
        const availableVariants = this.availableVariants();
        const filteredVariants = variants.filter(variant => availableVariants[variant]);
        const cacheKey = `viewMapFor(${JSON.stringify(filteredVariants)})`;
        if(!View.cache[cacheKey]){
            View.cache[cacheKey] = this.createViewMap(variants);
        }
        return View.cache[cacheKey];
    },

    availableVariants(){
        const cacheKey = 'availableVariants()';
        if(!View.cache[cacheKey]){
            const out = {};
            for(let viewName of View.names){
                const match = viewName.match(/^(|.+\/)_variants\/([^\/]+)\/(.*)$/);
                if(!match) continue;
                out[match[2]] = true;
            }
            View.cache[cacheKey] = out;
        }
        return View.cache[cacheKey];
    },

    createViewMap(variants){
        const out = {};

        for(let viewName of View.names){
            out[viewName] = viewName;
        }

        for(let variantName of variants){
            for(let viewName of Object.keys(out)){
                const pattern = new RegExp(`^(|.+\/)_variants\/${variantName}\/(.*)$`);
                const match = viewName.match(pattern);
                if(!match) continue;
                const overrideName = `${match[1]}${match[2]}`;
                out[overrideName] = viewName;
            }
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
