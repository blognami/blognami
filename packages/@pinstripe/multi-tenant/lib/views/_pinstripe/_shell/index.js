
export default {
    meta(){
        this.addHook('beforeRender', 'setCanonicalUrl');
    },

    async setCanonicalUrl(){
        const url = this.initialParams._url;
        if(!url) return;
        const host = await this.database.hosts.where({ canonical: true }).first();
        const canonicalHost = host ? host.name : url.hostname;
        const canonicalUrl = `${url.protocol}//${canonicalHost}${url.pathname}`;
        this.meta.push({ tagName: 'link', rel: 'canonical', href: canonicalUrl });
    }
}
