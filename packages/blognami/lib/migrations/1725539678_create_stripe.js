
export default {
    async migrate(){
        await this.database.table('stripes', async stripes => {
            await stripes.addColumn('secretKey', 'string');
        });
    }
};
