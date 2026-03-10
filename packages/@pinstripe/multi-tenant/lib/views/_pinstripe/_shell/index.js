
export default {
    meta(){
        this.addHook('beforeRender', 'setCanonicalUrl');
    },

    async setCanonicalUrl(){
        const url = this.initialParams._url;
        if(!url) return;
        const tenant = await this.database.tenant;
        const host = tenant ? await this.database.hosts.where({ tenantId: tenant.id, canonical: true }).first() : undefined;
        const canonicalHost = host ? host.name : url.hostname;
        const canonicalUrl = `${url.protocol}//${canonicalHost}${url.pathname}`;
        this.meta.push({ tagName: 'link', rel: 'canonical', href: canonicalUrl });
    }
}
