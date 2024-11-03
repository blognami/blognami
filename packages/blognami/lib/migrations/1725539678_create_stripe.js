
export default {
    async migrate(){
        await this.database.table('stripes', async stripes => {
            await stripes.addColumn('secretKey', 'string');
            await stripes.addColumn('webhookSecret', 'string');
        });
    }
};
