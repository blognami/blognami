
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
        const availableFeatureFlags = this.getAvailableFlags();
        const featureFlags = await this.featureFlags;
        for(const name in featureFlags){
            if(!availableFeatureFlags.includes(name)) continue;
            out[name] = featureFlags[name];
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

        for(const [name, isEnabled] of Object.entries(featureFlags)){
            if(!isEnabled) continue;
            for(let viewName of View.names){
                const mappedName = viewName.replace(/--[^/]+/g, '');
                if(mappedName == viewName) continue;
                const featureNames = View.for(viewName).featuresIsEnabledFor;
                if(!featureNames.includes(name)) continue;
                out[mappedName] = out[viewName];
            }
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