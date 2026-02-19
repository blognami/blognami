
export default {
    async render(){
        if(this.params._url.pathname == '/up') return;

        const tenant = await this.database.tenant;
        if(tenant) return;

        const headers = this.params._headers;
        const hostname = this.params._url.hostname;
        const host = (headers['host'] || hostname).replace(/:\d+$/, '').toLowerCase();

        const tenantByPreviousHost = await this.database.withoutTenantScope.tenants.where({ previousHost: host }).first();
        if(tenantByPreviousHost){
            const newUrl = `${this.params._url.protocol}//${tenantByPreviousHost.host}${this.params._url.pathname}${this.params._url.search}`;
            return [301, { 'location': newUrl }, []];
        }

        return [404, { 'content-type': 'text/plain' }, ['Not found']];
    }
};
