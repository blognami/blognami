import { View } from 'sintra';

export default {
    create(){
        return (...args) => this.defer(() => this.matchViews(...args));
    },

    async matchViews(includePatterns = "*", excludePatterns = []){
        const normalizedIncludePatterns = this.normalizePatterns(includePatterns);
        const normalizedExcludePatterns = this.normalizePatterns(excludePatterns);
        return await this.sortViews(Object.keys(await this.viewMap).filter(name => (
            normalizedIncludePatterns.some(pattern => pattern.test(name)) && !normalizedExcludePatterns.some(pattern => pattern.test(name))
        )));
    },

    normalizePatterns(patterns){
        let out = patterns;
        if(!Array.isArray(out)){
            out = [out];
        }
        return out.map(this.normalizePattern.bind(this));
    },

    normalizePattern(pattern){
        if(typeof pattern === 'string') {
            return new RegExp(`^${pattern.replace(/\*/g, '[^/]*')}$`);
        }
        return out;
    },

    async sortViews(views){
        const viewMap = await this.viewMap;
        const out = views.map(name => ({
            name,
            displayOrder: View.for(viewMap[name]).displayOrder ?? 100,
        }));
        out.sort((a, b) => {
            let out = a.displayOrder - b.displayOrder;
            if(out === 0){
                out = a.name.localeCompare(b.name);
            }
            return out;
        });
        return  out.map(({ name }) => name);
    }
};