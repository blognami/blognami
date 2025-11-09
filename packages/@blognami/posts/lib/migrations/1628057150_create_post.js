
export default {
    async migrate(){
        await this.database.table('posts', async posts => {
            await posts.addColumn('userId', 'foreign_key');
            await posts.addColumn('title', 'string');
            await posts.addColumn('slug', 'string', { index: true });
            await posts.addColumn('access', 'string', { index: true, default: 'public' });
            await posts.addColumn('body', 'text');
            await posts.addColumn('metaTitle', 'string');
            await posts.addColumn('metaDescription', 'text');
            await posts.addColumn('published', 'boolean',  { index: true });
            await posts.addColumn('publishedAt', 'datetime');
        });
    }
};
