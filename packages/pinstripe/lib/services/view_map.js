
import { View } from "../view.js";

export default {
    meta(){
        this.addToClient();
    },
    
    create(){
        return this.defer(async () => {
            const featureFlags = await this.getNormalizedFeatureFlags();
            const cacheKey = `viewMap:${JSON.stringify(featureFlags)}`;
            if(!View.cache[cacheKey]){
                View.cache[cacheKey] = this.createViewMap(featureFlags);
            }
            return View.cache[cacheKey];
        });
    },

    async getNormalizedFeatureFlags(){
        const out = {};
        const featureFlags = await this.featureFlags;
        for(let name of this.getAvailableFlags()){
            out[name] = featureFlags[name] ?? false;
        }
        return out;
    },

    getAvailableFlags(){
        const out = [];

        for(let viewName of View.names){
            for(let featureName of View.for(viewName).featuresIsEnabledFor){
                if(out.includes(featureName)) continue;
                out.push(featureName);
            }
        }

        out.sort();

        return out;
    },

    async createViewMap(featureFlags){
        const out = {};
        
        for(let name of View.names){
            const featuresIsEnabledFor = View.for(name).featuresIsEnabledFor;
            const isEnabled = featuresIsEnabledFor.length > 0 ? featuresIsEnabledFor.some(name => featureFlags[name]) : true;
            if(!isEnabled) continue;
            out[name] = name;
        }

        for(let viewName of Object.keys(out)){
            if(viewName.endsWith('/index')){
                const overrideName = viewName.replace(/\/index$/, '');
                out[overrideName] ??= out[viewName];
            }
        }

        return out;
    }
};