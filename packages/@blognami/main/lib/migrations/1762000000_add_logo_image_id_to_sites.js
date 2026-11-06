export default {
    async migrate(){
        await this.database.table('sites', async sites => {
            await sites.addColumn('logoImageId', 'foreign_key');
        });
    }
};
