
export default async ({ database: { posts } }) => {
    
    await posts.addColumn('title', 'string');
    await posts.addColumn('body', 'text');
    
};
