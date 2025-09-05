
export default {
    async migrate(){
        await this.database.table('usedHashes', async usedHashes => {
            await usedHashes.addColumn('value', 'string', { index: true });
            await usedHashes.addColumn('expiresAt', 'datetime', { index: true });
        });
    }
};
