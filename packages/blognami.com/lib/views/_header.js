
export default {
    meta(){
        this.addHook('render', async function(){
            if(await this.featureFlags.portal) return;
            const tenant = await this.database.tenant;
            const { subscriptionTier, subscriptionExpiresAt, id: tenantId, name: tenantName } = tenant;
            if(subscriptionTier != 'demo') return;
            const expirySeconds = Math.floor((subscriptionExpiresAt - Date.now()) / 1000);
            return this.renderView('_demo_banner', { expirySeconds, tenantId, tenantName }).assignProps({ displayOrder: 1 });
        });
    }
}
