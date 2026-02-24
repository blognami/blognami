
export default {
    meta(){
        this.addHook('render', async function(){
            if(await this.featureFlags.portal) return;
            const tenant = await this.database.tenant;
            const { subscriptionTier, subscriptionExpiresAt, id: tenantId } = tenant;
            if(subscriptionTier != 'demo') return;
            const canonicalHost = await tenant.hosts.where({ canonical: true }).first();
            const expirySeconds = Math.floor((subscriptionExpiresAt - Date.now()) / 1000);
            return this.renderView('_demo_banner', { expirySeconds, tenantId, canonicalHostName: canonicalHost?.name }).assignProps({ displayOrder: 1 });
        });
    }
}
