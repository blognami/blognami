
export default async ({ tenants, database }) => {

    await tenants.addColumn('name', 'string', { index: true });
    await tenants.addColumn('host', 'string', { index: true });

    const tableNames = Object.keys(await database.tables());

    while(tableNames.length){
        const tableName = tableNames.shift();
        if(tableName.match(/^pinstripe[A-Z]/)) continue;
        if(tableName == 'tenants') continue;
        if(await database[tableName].tenantId.exists()) continue;
        await database[tableName].addColumn('tenantId', 'foreign_key');
    }
};
