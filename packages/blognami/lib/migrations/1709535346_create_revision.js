
export default {
    async migrate(){
        await this.database.table('revisions', async revisions => {
            await revisions.addColumn('revisableId', 'string');
            await revisions.addColumn('userId', 'foreign_key');
            await revisions.addColumn('name', 'string');
            await revisions.addColumn('value', 'text');
            await revisions.addColumn('createdAt', 'datetime');
        });
    }
};
