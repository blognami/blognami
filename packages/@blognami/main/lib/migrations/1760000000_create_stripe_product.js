export default {
    async migrate(){
        await this.database.table('stripeProducts', async stripeProducts => {
            await stripeProducts.addColumn('name', 'string');
            await stripeProducts.addColumn('type', 'string');
            await stripeProducts.addColumn('stripeProductId', 'string');
        });
    }
};
