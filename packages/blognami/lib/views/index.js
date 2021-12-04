
export default async ({ session, renderView, renderHtml, database, params, renderList }) => {
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
        body: renderList(posts, ({ row: { slug, title, id, body } }) => renderHtml`
            <div class="card mb-4">
                <header class="card-header">
                    <a class="card-header-title" href="/${slug}">
                        ${title}
                    </a>
                    ${() => {
                        if(isSignedIn){
                            return renderHtml`
                                <a
                                    class="delete"
                                    style="margin: 7px;"
                                    href="/admin/delete_post?id=${id}"
                                    target="_overlay"
                                    data-confirm="Are you really sure you want to delete this post?"
                                ></a>
                            `;
                        }
                    }}
                </header>
                <div class="card-content">
                    <div class="content">
                        ${body}
                    </div>
                </div>
            </div>
        `)
    });
};
