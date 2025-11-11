export default {
    async migrate(){
        await this.database.table('sessions', async sessions => {
            await sessions.addColumn('passString', 'string');
            await sessions.addColumn('lastAccessedAt', 'datetime', { index: true });
        });
    }
};