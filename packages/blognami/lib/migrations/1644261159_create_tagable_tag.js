
export default {
    async migrate(){
        await this.database.table('tagableTags', async tagableTags => {
            await tagableTags.addColumn('tagableId', 'foreign_key');
            await tagableTags.addColumn('tagId', 'foreign_key');
        });
    }
};
