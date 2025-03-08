
export default {
    async migrate(){
        await this.database.table('pages', async pages => {
            await pages.addColumn('userId', 'foreign_key');
            await pages.addColumn('title', 'string');
            await pages.addColumn('slug', 'string', { index: true });
            await pages.addColumn('access', 'string', { index: true, default: 'public' });
            await pages.addColumn('body', 'text');
            await pages.addColumn('metaTitle', 'string');
            await pages.addColumn('metaDescription', 'text');
            await pages.addColumn('published', 'boolean',  { index: true });
            await pages.addColumn('publishedAt', 'datetime');
        });
    }
};
