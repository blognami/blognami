
export default {
    async migrate(){
        await this.database.table('sites', async sites => {
            await sites.addColumn('title', 'string');
            await sites.addColumn('description', 'text');
            await sites.addColumn('enableMonthlyPaidSubscriptions', 'boolean');
            await sites.addColumn('monthlyPaidSubscriptionPrice', 'decimal');    
            await sites.addColumn('enableYearlyPaidSubscriptions', 'boolean');   
            await sites.addColumn('yearlyPaidSubscriptionPrice', 'decimal');
            await sites.addColumn('enableFreeSubscriptions', 'boolean');
            await sites.addColumn('salt', 'string');
        });
    }
};
