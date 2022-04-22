
export default async ({ params, session, renderHtml, renderView }) => {
    const { user } = params;
    
    let sessionUser;
    if(await session){
        sessionUser = await session.user;
    }
    
    const isSignedIn = sessionUser !== undefined;
    let posts = user.posts;
    if(isSignedIn){
        posts = posts.orderBy('published', 'asc')
    } else {
        posts = posts.publishedEq(true);
    }
    posts = posts.orderBy('publishedAt', 'desc');

    const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
    
    posts = posts.paginate(1, pageSize);

    return renderView('_layout', {
        title: user.name,
        body: renderHtml`
            <section class="bn-section">
                <h2 class="bn-section-title">Latest posts by "${user.name}"</h2>

                <div class="bn-feed">
                    ${renderView('_posts', { posts })}
                </div>

                ${async () => {
                    if(await posts.count() == 0) return renderHtml`
                        Additional posts will be published soon.
                    `;
                }}

                ${async () => {
                    if(await posts.all().length < await posts.count()) return renderHtml`
                        <button class="bn-feed-loadmore bn-btn" data-node-wrapper="anchor" data-method="post" data-href="?pageSize=${pageSize + 10}">Load more posts</button>
                    `;
                }}
            </section>
        `
    });
};
