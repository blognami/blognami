
export default {
    async migrate(){
        await this.database.table('comments', async comments => {
            await comments.addColumn('commentableId', 'foreign_key');
            await comments.addColumn('userId', 'foreign_key');
            await comments.addColumn('body', 'text');
            await comments.addColumn('approved', 'boolean',  { index: true });
            await comments.addColumn('createdAt', 'datetime');
        });
    }
};
