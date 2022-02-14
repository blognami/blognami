
export default async ({ session, renderView, database, params }) => {
    let user;
    if(await session){
        user = await session.user;
    }

    const isSignedIn = user !== undefined;
    const page = parseInt(params.page || '1');
    let posts = database.posts;
    if(isSignedIn){
        posts = posts.orderBy('published', 'asc')
    } else {
        posts = posts.publishedEq(true);
    }
    posts = posts.orderBy('publishedAt', 'desc').paginate(page, 10);
    
    
    return renderView('_layout', {
        title: 'Blognami',
        isSignedIn,
        user,
        body: renderView('_posts', { isSignedIn, posts })
    });
};
