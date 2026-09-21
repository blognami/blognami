export default {
    meta(){
        this.addHook('sitemapEntries', async function(){
            if(!await this.featureFlags.docs) return;
            return (await this.docsPaths()).map(path => ({ path }));
        });
    },

    async docsPaths(){
        const viewMap = await this.viewMap;
        const paths = new Set();
        for(const name of Object.keys(viewMap)){
            if(name != 'docs' && !name.startsWith('docs/')) continue;
            if(name.split('/').some(segment => segment.startsWith('_'))) continue;
            paths.add(name.replace(/\/index$/, ''));
        }
        return [...paths];
    }
};
