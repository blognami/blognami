
export default async ({ site, database, session, params, renderHtml, renderView, stylesheets, renderMarkdown }) => {
    const { title, body } = params;

    let user;
    if(await session){
        user = await session.user;
    }

    const isSignedIn = user !== undefined;
    
    let posts = database.posts;
    if(isSignedIn){
        posts = posts.orderBy('published', 'asc')
    } else {
        posts = posts.publishedEq(true);
    }

    posts = posts.orderBy('publishedAt', 'desc');

    const featuredPosts = posts.featuredEq(true);
    
    const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
    posts = posts.paginate(1, pageSize);

    const tags = database.posts.tags.orderBy('name');
    
    return renderHtml`
        <!DOCTYPE html>
        <html lang="${site.language}">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>${title || site.title}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Inter:wght@400;500;600;700;800&display=swap">
                ${stylesheets.map(viewName => renderHtml`
                    <link rel="stylesheet" href="/${viewName}">
                `)}
                <script src="/bundle.js"></script>
            </head>
            
            <body>
                <div class="navbar">
                    <div class="navbar-inner">
                        <div class="navbar-brand">
                            <a class="navbar-item" href="/">${site.title}</a>
                        </div>
                        <div class="navbar-menu">
                            ${() => {
                                if(isSignedIn) return renderHtml`
                                    <div class="navbar-item has-dropdown">
                                        Add
                                        <div class="navbar-dropdown">
                                            <a class="navbar-item" href="/admin/add_page?userId=${user.id}" target="_overlay">Page</a>
                                            <a class="navbar-item" href="/admin/add_post?userId=${user.id}" target="_overlay">Post</a>
                                        </div>
                                    </div>
                                    <a class="navbar-item" href="/sign_out" target="_overlay">Sign out</a>
                                `;
                                return renderHtml`
                                    <a class="navbar-item" href="/sign_in" target="_overlay">Sign in</a>
                                `;
                            }}
                        </div>
                    </div>
                </div>
                <div class="bn-site">
                    <main id="bn-main" class="bn-main bn-outer">
                        <div class="bn-inner">
                            <div class="bn-wrapper">

                                ${body}

                                <aside class="bn-sidebar">
                                    <section class="bn-section">
                                        <h2 class="bn-section-title">About</h2>
                                            ${async () => {
                                                if(isSignedIn) return renderHtml`
                                                    <div class="bn-editable-area">
                                                        <div class="bn-editable-area-header">
                                                            <a class="bn-editable-area-button" href="/admin/edit_site_description" target="_overlay">Edit</a>
                                                        </div>
                                                        <div class="bn-editable-area-body">
                                                            ${renderMarkdown(await site.description)}
                                                        </div>
                                                    </div>
                                                `;
                                                return renderMarkdown(await site.description)
                                            }}
                                    </section>
                    
                                    ${async () => {
                                        if(await featuredPosts.count() > 0) return renderHtml`
                                            <section class="bn-section">
                                                <h3 class="bn-section-title">Featured</h3>
                                                <div class="bn-featured bn-feed">
                                                    ${renderView('_posts', { posts: featuredPosts })}
                                                </div>
                                            </section>
                                        `;
                                    }}

                                    ${async () => {
                                        if(await tags.count() > 0) return renderHtml`
                                            <section class="bn-section">
                                                <h3 class="bn-section-title">Tags</h3>
                        
                                                <div class="bn-tags">
                                                    ${tags.all().map(({ name, slug }) => renderHtml`
                                                        <a class="bn-tags-item" href="/${slug}">
                                                            <h3 class="bn-tags-name">${name}</h3>
                                                            <span class="bn-tags-count">
                                                                ${async () => {
                                                                    const count = await database.posts.taggedWith(name).count();
                                                                    if(count == 1) return renderHtml`
                                                                        ${count} post
                                                                    `;

                                                                    return renderHtml`
                                                                        ${count} posts
                                                                    `;
                                                                }}
                                                            </span>
                                                        </a>
                                                    `)}
                                                </div>
                                            </section>
                                        `;
                                    }}
                                </aside>
                            </div>
                        </div>
                    </main>
                    <footer class="bn-foot bn-outer">
                        <div class="bn-foot-inner bn-inner">
                            <div class="bn-copyright">
                                ${site.title} © ${new Date().getFullYear()}
                            </div>    
                            <div class="bn-powered-by">
                                <a href="https://blognami.org/" target="_blank" rel="noopener">Powered by Blognami</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    `;
}

