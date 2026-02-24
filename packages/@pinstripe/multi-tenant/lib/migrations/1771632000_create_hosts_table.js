
export default {
    async migrate(){
        await this.database.table('hosts', async hosts => {
            await hosts.addColumn('tenantId', 'foreign_key');
            await hosts.addColumn('name', 'string', { index: true });
            await hosts.addColumn('canonical', 'boolean', { default: false });
            await hosts.addColumn('type', 'string', { index: true });
        });
    }
};
