
export default {
    async migrate(){
        await this.database.table('subscriptions', async subscriptions => {
            await subscriptions.addColumn('subcribableId', 'foreign_key');
            await subscriptions.addColumn('userId', 'foreign_key');
            await subscriptions.addColumn('tier', 'string');
            await subscriptions.addColumn('expiresAt', 'datetime');
        });
    }
};
