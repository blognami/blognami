
export default async ({ params, renderHtml, renderMarkdown, formatDate, renderView, posts, session }) => {
    const { post } = params;

    const postUser = await post.user;

    const previousPost = await posts.idNe(post.id).publishedAtLt(post.publishedAt).orderBy('publishedAt', 'desc').first();
    const nextPost = await posts.idNe(post.id).publishedAtGt(post.publishedAt).orderBy('publishedAt', 'asc').first();

    let user;
    if(await session){
        user = await session.user;
    }

    const isSignedIn = user !== undefined;
    const isAdmin = isSignedIn && user.role == 'admin';

    return renderView('_layout', {
        title: post.title,
        body: renderHtml`
            <section class="bn-section">
                <article class="bn-article">
                    <header class="bn-article-header bn-canvas">
                        <span class="bn-article-meta">
                            By <a href="/${postUser.slug}">${postUser.name}</a>
                            
                            ${async () => {
                                if(await post.tags.count() > 0) return renderHtml`
                                    in
                                    ${post.tags.all().map(({ slug, name }, i) => renderHtml`${i > 0 ? ', ' : ''}<a class="bn-article-tag" href="/${slug}">${name}</a>`)}
                                `;
                            }}
                            —
                            <time datetime="${formatDate(post.publishedAt, 'yyyy-MM-dd')}">${formatDate(post.publishedAt)}</time>
                        </span>

                        <h1 class="bn-article-title">${post.title}</h1>

                    </header>

                    <div class="bn-content bn-canvas">
                        ${() => {
                            if(isAdmin) return renderHtml`
                                <div class="bn-editable-area">
                                    <div class="bn-editable-area-header">
                                        <a class="bn-editable-area-button" href="/admin/edit_post?id=${post.id}" target="_overlay">Edit</a>
                                    </div>
                                    <div class="bn-editable-area-body">
                                        ${renderMarkdown(post.body)}
                                    </div>
                                </div>
                            `;
                            return renderMarkdown(post.body);
                        }}
                        
                    </div>

                    <footer class="bn-article-footer bn-canvas">
                        <nav class="bn-navigation">
                            <div class="bn-navigation-previous">
                                ${() => {
                                    if(previousPost) return renderHtml`
                                        <a class="bn-navigation-link" href="/${previousPost.slug}">
                                            <span class="bn-navigation-label">Previous issue</span>
                                            <h4 class="bn-navigation-title">${previousPost.title}</h4>
                                        </a>
                                    `;
                                }}
                            </div>

                            <div class="bn-navigation-middle"></div>

                            <div class="bn-navigation-next">
                                ${() => {
                                    if(nextPost) return renderHtml`
                                        <a class="bn-navigation-link" href="/${nextPost.slug}">
                                            <span class="bn-navigation-label">Next issue</span>
                                            <h4 class="bn-navigation-title">${nextPost.title}</h4>
                                        </a>
                                    `;
                                }}
                            </div>
                        </nav>
                    </footer>
                </article>
            </section>
        `
    });
};
