
export default {
    async migrate(){
        await this.database.table('notifications', async notifications => {
            await notifications.addColumn('userId', 'foreign_key');
            await notifications.addColumn('body', 'text');
            await notifications.addColumn('bodyHash', 'string', { index: true });
            await notifications.addColumn('counter', 'integer', { default: 1 });
            await notifications.addColumn('createdAt', 'datetime');
            await notifications.addColumn('updatedAt', 'datetime');
        });
    }
};
