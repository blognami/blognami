
export default {
    async render(){
        const { tenantId } = this.params;
        if(!tenantId) return [400, { 'content-type': 'application/json' }, [JSON.stringify({ error: 'tenantId required' })]];

        const tenant = await this.database.withoutTenantScope.tenants.where({ id: tenantId }).first();
        if(!tenant) return [404, { 'content-type': 'application/json' }, [JSON.stringify({ error: 'tenant not found' })]];

        await tenant.update({
            subscriptionTier: 'paid',
            subscriptionExpiresAt: null,
            lifecycleStatus: 'active'
        });

        return [200, { 'content-type': 'application/json' }, [JSON.stringify({ ok: true })]];
    }
};
