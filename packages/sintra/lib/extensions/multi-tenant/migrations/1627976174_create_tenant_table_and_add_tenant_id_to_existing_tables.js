
export default {
    async migrate(){
        await this.database.table('tenants', async tenants => {
            await tenants.addColumn('name', 'string', { index: true });
            await tenants.addColumn('host', 'string', { index: true });
        });  
    
        const tableNames = Object.keys(this.database.info).filter(name => this.database.info[name] == 'table');
    
        while(tableNames.length){
            const tableName = tableNames.shift();
            if(tableName.match(/^sintra[A-Z]/)) continue;
            if(tableName == 'tenants') continue;
            
            if(this.database[tableName].constructor.columns.tenantId) continue;
            await this.database[tableName].addColumn('tenantId', 'foreign_key');
        }
    }
};
