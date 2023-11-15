
export default {
    async migrate(){
        await this.database.table('images', async images => {
            await images.addColumn('title', 'string');
            await images.addColumn('slug', 'string', { index: true });
            await images.addColumn('type', 'string');
            await images.addColumn('data', 'binary');
        });
    }
};
