
export default {
    async migrate(){
        await this.database.table('tenants', async tenants => {
            await tenants.addColumn('previousHost', 'string', { index: true });
        });
    }
};
