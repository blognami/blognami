
export default {
    async migrate(){
        await this.database.table('users', async users => {
            await users.addColumn('slug', 'string', { index: true });
        });
    }
};
