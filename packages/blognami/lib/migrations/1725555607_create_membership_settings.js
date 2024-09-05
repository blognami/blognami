
export default {
    async migrate(){
        await this.database.table('membershipSettings', async membershipSettings => {
            await membershipSettings.addColumn('enableMonthly', 'boolean');
            await membershipSettings.addColumn('monthlyPrice', 'decimal');
            await membershipSettings.addColumn('enableYearly', 'boolean');
            await membershipSettings.addColumn('yearlyPrice', 'decimal');
            await membershipSettings.addColumn('enableFree', 'boolean');
        });
    }
};
