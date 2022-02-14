
export default async ({ database }) => {
    
    await database.tagableTags.addColumn('tagableId', 'foreign_key');
    await database.tagableTags.addColumn('tagId', 'foreign_key');
    
};
