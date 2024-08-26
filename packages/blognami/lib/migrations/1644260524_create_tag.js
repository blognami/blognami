
export default {
    async migrate(){
        await this.database.table('tags', async tags => {
            await tags.addColumn('name', 'string', { index: true });
            await tags.addColumn('slug', 'string', { index: true });
            await tags.addColumn('metaTitle', 'string');
            await tags.addColumn('metaDescription', 'text');
        });
    }
};
