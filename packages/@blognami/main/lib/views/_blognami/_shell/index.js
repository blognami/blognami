
export default {
    meta(){
        this.addHook('beforeRender', 'setRoleAsLoadCacheNamespace');
        this.addHook('beforeRender', 'setSiteTitleFallback');
    },

    async setRoleAsLoadCacheNamespace(){
        if(await this.isSignedOut) return;
        this.meta.push({ tagName: 'meta', name: 'blognami-load-cache-namespace', content: this.user.role });
    },

    async setSiteTitleFallback(){
        if(this.hasTitle()) return;
        const siteTitle = (await this.database.site.title)?.trim();
        if(siteTitle) this.meta.push({ title: siteTitle });
    }
}
