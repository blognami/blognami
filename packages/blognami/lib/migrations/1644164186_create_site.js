
export default {
    async migrate(){
        await this.database.table('sites', async sites => {
            await sites.addColumn('title', 'string');
            await sites.addColumn('description', 'text');
            await sites.addColumn('salt', 'string');
        });
    }
};
