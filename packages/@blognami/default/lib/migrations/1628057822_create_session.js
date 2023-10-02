
export default {
    async migrate(){
        await this.database.table('sessions', async sessions => {
            await sessions.addColumn('passString', 'string');
            await sessions.addColumn('userId', 'foreign_key');
            await sessions.addColumn('lastAccessedAt', 'datetime', { index: true });
        });
    }
};
