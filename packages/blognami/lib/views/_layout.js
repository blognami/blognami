
export default {
    async render(){
        const { params } = this;
        const { title, body } = params;
    
        let user;
        if(await this.session){
            user = await this.session.user;
        }
    
        const isSignedIn = user !== undefined;
        
        let posts = this.database.posts;
        if(isSignedIn){
            posts = posts.orderBy('published', 'asc')
        } else {
            posts = posts.where({ published: true });
        }
    
        posts = posts.orderBy('publishedAt', 'desc');
    
        const featuredPosts = posts.where({ featured: true });
        
        const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        posts = posts.paginate(1, pageSize);
    
        const tags = this.database.posts.tags.orderBy('name');
    
        const site = await this.database.site;
        
        return this.renderHtml`
            <!DOCTYPE html>
            <html lang="${site.language}">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>${title || site.title}</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Inter:wght@400;500;600;700;800&display=swap">
                    <link rel="stylesheet" href="/assets/stylesheets/all.css">
                    <script src="/assets/javascripts/all.js"></script>
                </head>
                
                <body>
                    <div class="navbar">
                        <div class="navbar-inner">
                            <div class="navbar-brand">
                                <a class="navbar-item" href="/">${site.title}</a>
                            </div>
                            <div class="navbar-menu">
                                ${() => {
                                    if(isSignedIn) return this.renderHtml`
                                        <div class="navbar-item has-dropdown">
                                            Add
                                            <div class="navbar-dropdown">
                                                <a class="navbar-item" href="/admin/add_page?userId=${user.id}" target="_overlay">Page</a>
                                                <a class="navbar-item" href="/admin/add_post?userId=${user.id}" target="_overlay">Post</a>
                                            </div>
                                        </div>
                                        <a class="navbar-item" href="/sign_out" target="_overlay">Sign out</a>
                                    `;
                                    return this.renderHtml`
                                        <a class="navbar-item" href="/sign_in" target="_overlay">Sign in</a>
                                    `;
                                }}
                            </div>
                        </div>
                    </div>
                    <div class="site">
                        <main id="main" class="main outer">
                            <div class="inner">
                                <div class="wrapper">
    
                                    ${body}
    
                                    <aside class="sidebar">
                                        <section class="section">
                                            <h2 class="section-title">About</h2>
                                                ${async () => {
                                                    if(isSignedIn) return this.renderHtml`
                                                        <div class="editable-area">
                                                            <div class="editable-area-header">
                                                                <a class="editable-area-button" href="/admin/edit_site_description" target="_overlay">Edit</a>
                                                            </div>
                                                            <div class="editable-area-body">
                                                                ${this.renderMarkdown(await site.description)}
                                                            </div>
                                                        </div>
                                                    `;
                                                    return this.renderMarkdown(await site.description)
                                                }}
                                        </section>
                        
                                        ${async () => {
                                            if(await featuredPosts.count() > 0) return this.renderHtml`
                                                <section class="section">
                                                    <h3 class="section-title">Featured</h3>
                                                    <div class="featured feed">
                                                        ${this.renderView('_posts', { posts: featuredPosts })}
                                                    </div>
                                                </section>
                                            `;
                                        }}
    
                                        ${async () => {
                                            if(await tags.count() > 0) return this.renderHtml`
                                                <section class="section">
                                                    <h3 class="section-title">Tags</h3>
                            
                                                    <div class="tags">
                                                        ${tags.all().map(({ name, slug }) => this.renderHtml`
                                                            <a class="tags-item" href="/${slug}">
                                                                <h3 class="tags-name">${name}</h3>
                                                                <span class="tags-count">
                                                                    ${async () => {
                                                                        const count = await this.database.posts.where({ taggedWith: name }).count();
                                                                        if(count == 1) return this.renderHtml`
                                                                            ${count} post
                                                                        `;
    
                                                                        return this.renderHtml`
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
                        <footer class="foot outer">
                            <div class="foot-inner inner">
                                <div class="copyright">
                                    ${site.title} © ${new Date().getFullYear()}
                                </div>    
                                <div class="powered-by">
                                    <a href="https://blognami.org/" target="_blank" rel="noopener">Powered by Blognami</a>
                                </div>
                            </div>
                        </footer>
                    </div>
                </body>
            </html>
        `;
    }
};

