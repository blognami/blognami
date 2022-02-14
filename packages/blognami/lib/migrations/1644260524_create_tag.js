
export default async ({ database }) => {
    
    await database.tags.addColumn('name', 'string', { index: true });
    await database.tags.addColumn('slug', 'string', { index: true });
    
};
