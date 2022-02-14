
export default async ({ renderHtml, session, params, database, renderView }) => {
    if(!params.pageable) return;

    let user;
    if(await session){
        user = await session.user;
    }

    const isSignedIn = user !== undefined;
    const page = parseInt(params.page || '1');
    let posts = database.posts.taggedWith(params.pageable.name);
    if(isSignedIn){
        posts = posts.orderBy('published', 'asc')
    } else {
        posts = posts.publishedEq(true);
    }
    posts = posts.orderBy('publishedAt', 'desc').paginate(page, 10);

    return renderHtml`
        <div class="content">
            <h1 class="title">${params.pageable.name}</h1>
            ${renderView('_posts', { isSignedIn, posts })}
        </div>
    `;
}