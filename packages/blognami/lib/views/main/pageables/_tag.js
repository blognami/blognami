
export default async ({ renderHtml, session, params, database, renderView  }) => {
    const { tag } = params;

    let user;
    if(await session){
        user = await session.user;
    }
    
    const isSignedIn = user !== undefined;
    let posts = database.posts.taggedWith(tag.name);
    if(isSignedIn){
        posts = posts.orderBy('published', 'asc')
    } else {
        posts = posts.publishedEq(true);
    }
    posts = posts.orderBy('publishedAt', 'desc');

    const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
    
    posts = posts.paginate(1, pageSize);


    return renderView('_layout', {
        title: tag.name,
        body: renderHtml`
            <section class="bn-section">
                <h2 class="bn-section-title">Latest posts tagged "${tag.name}"</h2>

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
