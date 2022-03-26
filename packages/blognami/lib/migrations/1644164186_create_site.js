
export default async ({ database }) => {
    
    await database.sites.addColumn('title', 'string');
    await database.sites.addColumn('description', 'string');
    await database.sites.addColumn('accentColor', 'string');
    await database.sites.addColumn('language', 'string');
    
};
