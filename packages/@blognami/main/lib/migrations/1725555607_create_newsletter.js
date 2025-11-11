export default {
    async migrate(){
        await this.database.table('newsletters', async newsletter => {
            await newsletter.addColumn('enableMonthly', 'boolean');
            await newsletter.addColumn('monthlyPrice', 'decimal');
            await newsletter.addColumn('enableYearly', 'boolean');
            await newsletter.addColumn('yearlyPrice', 'decimal');
            await newsletter.addColumn('currency', 'string', { default: 'USD' });
            await newsletter.addColumn('enableFree', 'boolean', { default: true });
        });
    }
};