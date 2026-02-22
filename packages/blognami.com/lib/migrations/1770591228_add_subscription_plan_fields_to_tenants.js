
export default {
    async migrate(){
        await this.database.table('tenants', async tenants => {
            await tenants.addColumn('subscriptionPlan', 'string', { index: true, default: 'none' });
            await tenants.addColumn('subscriptionInterval', 'string');
        });
    }
};
