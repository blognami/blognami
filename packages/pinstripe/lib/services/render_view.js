
import { View } from '../view.js';

export const client = true;

export default {
    create(){
        return async (name, params = {}, options = {}) => {
            const { theme = await this.theme, variants = await this.variants } = options;
            const viewMap = this.viewMapFor({ theme, variants });
            const mappedName = viewMap[name];
            if(!mappedName) return;
            return View.render(this.context, mappedName, params);
        }
    },

    viewMapFor({ theme, variants }){
        const availableThemes = this.availableThemes();
        const availableVariants = this.availableVariants();
        const filteredTheme = availableThemes.has(theme) ? theme : 'default';
        const filteredVariants = variants.filter(variant => availableVariants.has(variant));
        const params = { theme: filteredTheme, variants: filteredVariants };
        const cacheKey = `viewMapFor(${JSON.stringify(params)})`;
        if(!View.cache[cacheKey]){
            View.cache[cacheKey] = this.createViewMap(params);
        }
        return View.cache[cacheKey];
    },
    
    availableThemes(){
        const cacheKey = 'availableThemes()';
        if(!View.cache[cacheKey]){
            const out = new Set(['default']);
            for(let viewName of View.names){
                const match = viewName.match(/^(|.+\/)_themes\/([^\/]+)\/(.*)$/);
                if(!match) continue;
                out.add(match[2]);
            }
            View.cache[cacheKey] = out;
        }
        return View.cache[cacheKey];
    },

    availableVariants(){
        const cacheKey = 'availableVariants()';
        if(!View.cache[cacheKey]){
            const out = new Set();
            for(let viewName of View.names){
                const match = viewName.match(/^(|.+\/)_variants\/([^\/]+)\/(.*)$/);
                if(!match) continue;
                out.add(match[2]);
            }
            View.cache[cacheKey] = out;
        }
        return View.cache[cacheKey];
    },

    createViewMap({ theme, variants}){
        const out = {};

        for(let viewName of View.names){
            out[viewName] = viewName;
        }

        for(let viewName of Object.keys(out)){
            const pattern = new RegExp(`^(|.+\/)_themes\/${theme}\/(.*)$`);
            const match = viewName.match(pattern);
            if(!match) continue;
            const overrideName = `${match[1]}${match[2]}`;
            out[overrideName] = viewName;
        }

        while(true) {
            let changed = false;
            for(let variantName of variants){
                for(let viewName of Object.keys(out)){
                    const pattern = new RegExp(`^(|.+\/)_variants\/${variantName}\/(.*)$`);
                    const match = viewName.match(pattern);
                    if(!match) continue;
                    const overrideName = `${match[1]}${match[2]}`;
                    if(out[overrideName] == viewName) continue;
                    out[overrideName] = viewName;
                    changed = true;
                }
            }
            if(!changed) break;
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
