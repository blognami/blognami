
export default async ({ database }) => {
    
    await database.sites.addColumn('title', 'string');
    await database.sites.addColumn('sidebar', 'text');
    
};
