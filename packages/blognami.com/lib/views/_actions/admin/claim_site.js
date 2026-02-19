
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default {
    async render(){
        const { slug } = this.params;

        const errors = this.validateSubdomain(slug);
        if(errors.length > 0){
            return jsonResponse({ success: false, errors });
        }

        const tenant = await this.database.tenant;
        if(!tenant){
            return jsonResponse({ success: false, errors: ['Tenant not found.'] });
        }

        if(!UUID_REGEX.test(tenant.name)){
            return jsonResponse({ success: false, errors: ['You have already claimed a subdomain.'] });
        }

        const { subscriptionTier } = tenant;
        if(subscriptionTier !== 'demo' && !tenant.isActive){
            return jsonResponse({ success: false, errors: ['An active subscription is required to claim a subdomain.'] });
        }

        const tenantId = tenant.id;
        const oldHost = tenant.host;

        const existingByName = await this.database.withoutTenantScope.tenants.where({ name: slug }).first();
        if(existingByName){
            return jsonResponse({ success: false, errors: ['This subdomain is already taken.'] });
        }

        const newHost = `${slug}.blognami.com`;
        const existingByHost = await this.database.withoutTenantScope.tenants.where({ host: newHost }).first();
        if(existingByHost){
            return jsonResponse({ success: false, errors: ['This subdomain is already taken.'] });
        }

        await this.runInNewPortalWorkspace(async function(){
            const portalTenant = await this.database.tenants.where({ id: tenantId }).first();
            await portalTenant.update({
                name: slug,
                host: newHost,
                previousHost: oldHost
            });
        });

        return jsonResponse({ success: true, newHost });
    }
};

function jsonResponse(data){
    return [200, { 'content-type': 'application/json' }, [JSON.stringify(data)]];
}
