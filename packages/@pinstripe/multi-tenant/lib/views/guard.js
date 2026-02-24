
export default {
    async render(){
        if(this.params._url.pathname == '/up') return;

        if(await this.database.tenant) return;

        const headers = this.params._headers;
        const hostname = this.params._url.hostname;
        const host = (headers['host'] || hostname).replace(/:\d+$/, '').toLowerCase();

        const redirectHost = await this.database.hosts.where({ name: host, type: 'redirect' }).first();
        if(redirectHost){
            const canonicalHost = await this.database.hosts.where({ tenantId: redirectHost.tenantId, canonical: true }).first();
            if(canonicalHost){
                const newUrl = `${this.params._url.protocol}//${canonicalHost.name}${this.params._url.pathname}${this.params._url.search}`;
                return [301, { 'location': newUrl }, []];
            }
        }

        return [404, {'content-type': 'text/plain'}, ['Not found']];
    }
};
