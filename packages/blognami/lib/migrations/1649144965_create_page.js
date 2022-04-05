
export default async ({ pages }) => {
    
    await pages.addColumn('userId', 'foreign_key');
    await pages.addColumn('title', 'string');
    await pages.addColumn('slug', 'string', { index: true });
    await pages.addColumn('body', 'text');
    await pages.addColumn('published', 'boolean',  { index: true });
    await pages.addColumn('publishedAt', 'datetime');
    
};
