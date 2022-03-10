
export default async ({ posts }) => {
    
    await posts.addColumn('userId', 'foreign_key');
    await posts.addColumn('title', 'string');
    await posts.addColumn('excerpt', 'text');
    await posts.addColumn('slug', 'string', { index: true });
    await posts.addColumn('body', 'text');
    await posts.addColumn('visibility', 'string');
    await posts.addColumn('published', 'boolean',  { index: true });
    await posts.addColumn('featured', 'boolean',  { index: true });
    await posts.addColumn('publishedAt', 'datetime');
    
};
