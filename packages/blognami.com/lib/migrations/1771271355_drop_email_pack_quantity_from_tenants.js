
export default {
    async migrate(){
        await this.database.table('tenants', async tenants => {
            await tenants.removeColumn('emailPackQuantity');
        });
    }
};
