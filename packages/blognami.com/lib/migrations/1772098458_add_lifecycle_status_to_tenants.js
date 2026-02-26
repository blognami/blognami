
export default {
    async migrate(){
        await this.database.table('tenants', async tenants => {
            await tenants.addColumn('lifecycleStatus', 'string', { index: true, default: 'active' });
        });
    }
};
