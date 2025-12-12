
export default {
    meta(){
        this.addHook('render', async function(){
            if(await this.featureFlags.portal) return;
            const { subscriptionTier, subscriptionExpiresAt } = await this.database.tenant;
            if(subscriptionTier != 'demo') return;
            const expirySeconds = Math.floor((subscriptionExpiresAt - Date.now()) / 1000);
            return this.renderView('_demo_banner', { expirySeconds  }).assignProps({ displayOrder: 1 });
        });
    }
}
