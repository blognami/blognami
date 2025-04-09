
export default {
    async migrate(){
        await this.database.table('membershipTiers', async membershipTiers => {
            await membershipTiers.addColumn('enableMonthly', 'boolean');
            await membershipTiers.addColumn('monthlyPrice', 'decimal');
            await membershipTiers.addColumn('enableYearly', 'boolean');
            await membershipTiers.addColumn('yearlyPrice', 'decimal');
            await membershipTiers.addColumn('currency', 'string', { default: 'USD' });
            await membershipTiers.addColumn('enableFree', 'boolean', { default: true });
        });
    }
};
