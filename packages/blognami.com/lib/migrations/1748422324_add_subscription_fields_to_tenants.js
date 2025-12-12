
export default {
    async migrate(){
        await this.database.table('tenants', async tenants => {
            await tenants.addColumn('subscriptionTier', 'string', { index: true, default: 'none' });
            await tenants.addColumn('subscriptionExpiresAt', 'datetime');
        });

        await this.database.tenants.update({
            subscriptionTier: 'permanent'
        });
    }
};
