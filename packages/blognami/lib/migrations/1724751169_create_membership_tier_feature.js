
export default {
    async migrate(){
        await this.database.table('membershipTierFeatures', async membershipTierFeatures => {
            await membershipTierFeatures.addColumn('membershipTierId', 'string');
            await membershipTierFeatures.addColumn('name', 'string');
            await membershipTierFeatures.addColumn('displayOrder', 'integer');
        });
    }
};
