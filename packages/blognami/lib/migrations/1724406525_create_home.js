
export default {
    async migrate(){
        await this.database.table('homes', async homes => {
            await homes.addColumn('metaTitle', 'string');
            await homes.addColumn('metaDescription', 'text');
        });
    }
};
