
export default {
    async migrate(){
        await this.database.table('membershipTiers', async membershipTiers => {
            await membershipTiers.addColumn('name', 'string');
            await membershipTiers.addColumn('monthlyPrice', 'number');
            await membershipTiers.addColumn('yearlyPrice', 'number');
            await membershipTiers.addColumn('freeTrialDays', 'integer');  
            await membershipTiers.addColumn('archived', 'boolean');
        });
    }
};
