
export default async ({ database }) => {
    
    await database.sites.addColumn('title', 'string');
    await database.sites.addColumn('description', 'text');
    await database.sites.addColumn('accentColor', 'string');
    await database.sites.addColumn('language', 'string');
    
};
