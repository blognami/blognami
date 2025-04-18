
export default {
    async migrate(){
        await this.database.table('posts', async posts => {
            await posts.addColumn('enableComments', 'boolean');
        });
    }
};
