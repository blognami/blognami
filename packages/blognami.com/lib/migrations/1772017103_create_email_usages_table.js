
export default {
    async migrate(){
        await this.database.table('emailUsages', async emailUsages => {
            await emailUsages.addColumn('tenantId', 'foreign_key');
            await emailUsages.addColumn('periodStart', 'date', { index: true });
            await emailUsages.addColumn('periodEnd', 'date');
            await emailUsages.addColumn('emailsSent', 'integer', { default: 0 });
            await emailUsages.addColumn('createdAt', 'datetime');
            await emailUsages.addColumn('updatedAt', 'datetime');
        });
    }
};
