
export default {
    meta(){
        this.addHook('beforeRender', 'setRoleAsLoadCacheNamespace');
        this.addHook('beforeRender', 'setSiteTitleFallback');
        this.addHook('beforeRender', 'setSocialImage');
    },

    async setRoleAsLoadCacheNamespace(){
        if(await this.isSignedOut) return;
        this.meta.push({ tagName: 'meta', name: 'blognami-load-cache-namespace', content: this.user.role });
    },

    async setSiteTitleFallback(){
        if(this.hasTitle()) return;
        const siteTitle = (await this.database.site.title)?.trim();
        if(siteTitle) this.meta.push({ title: siteTitle });
    },

    async setSocialImage(){
        if(this.mergeMeta(this.meta).some(({ tagName, property }) => tagName == 'meta' && property == 'og:image')) return;
        const coverImage = await this.database.site.coverImage;
        const image = coverImage ?? await this.database.site.logoImage;
        if(!image) return;
        const content = new URL(`/${image.slug}`, this.initialParams._url).href;
        this.meta.push({ property: 'og:image', content });
        this.meta.push({ name: 'twitter:image', content });
        this.meta.push({ name: 'twitter:card', content: coverImage ? 'summary_large_image' : 'summary' });
    }
}
