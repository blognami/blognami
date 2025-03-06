export default {
    create(){
        return (...args) => this.defer(() => this.matchViews(...args));
    },

    async matchViews(includePatterns = "*", excludePatterns = []){
        const normalizedIncludePatterns = this.normalizePatterns(includePatterns);
        const normalizedExcludePatterns = this.normalizePatterns(excludePatterns);
        return Object.keys(await this.app.viewMap).filter(name => (
            normalizedIncludePatterns.some(pattern => pattern.test(name)) && !normalizedExcludePatterns.some(pattern => pattern.test(name))
        ));
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
            return new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
        }
        return out;
    }
};