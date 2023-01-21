
export default {
    async render(){
        const { post } = this.params;

        const postUser = await post.user;
    
        const previousPost = await this.database.posts.where({ idNe: post.id, publishedAtLt: post.publishedAt }).orderBy('publishedAt', 'desc').first();
    
        const nextPost = await  this.database.posts.where({ idNe: post.id, publishedAtGt: post.publishedAt }).orderBy('publishedAt', 'asc').first();
    
        let user;
        if(await this.session){
            user = await this.session.user;
        }
    
        const isSignedIn = user !== undefined;
        const isAdmin = isSignedIn && user.role == 'admin';

        if(!post.published && !isAdmin) return;
    
        return this.renderView('_layout', {
            title: post.title,
            body: this.renderHtml`
                <section class="section">
                    <article class="article">
                        <header class="article-header canvas">
                            <span class="article-meta">
                                By <a href="/${postUser.slug}">${postUser.name}</a>
                                
                                ${async () => {
                                    if(await post.tags.count() > 0) return this.renderHtml`
                                        in
                                        ${post.tags.all().map(({ slug, name }, i) => this.renderHtml`${i > 0 ? ', ' : ''}<a class="article-tag" href="/${slug}">${name}</a>`)}
                                    `;
                                }}
                                —
                                <time datetime="${this.formatDate(post.publishedAt, 'yyyy-MM-dd')}">${this.formatDate(post.publishedAt)}</time>
                            </span>
                            
                            ${() => {
                                if(isAdmin) return this.renderHtml`
                                    <div class="editable-area">
                                        <div class="editable-area-header">
                                            <a class="editable-area-button" href="/admin/edit_post_title?id=${post.id}" target="_overlay">Edit</a>
                                        </div>
                                        <div class="editable-area-body">
                                            <h1 class="article-title">${post.title}</h1>
                                        </div>
                                    </div>
                                `;
                                return this.renderHtml`
                                    <h1 class="article-title">${post.title}</h1>
                                `;
                            }}
    
                        </header>
    
                        <div class="content canvas">
                            ${() => {
                                if(isAdmin) return this.renderHtml`
                                    <div class="editable-area">
                                        <div class="editable-area-header">
                                            <a class="editable-area-button" href="/admin/edit_post_body?id=${post.id}" target="_overlay">Edit</a>
                                        </div>
                                        <div class="editable-area-body content canvas">
                                            ${this.renderMarkdown(post.body)}
                                        </div>
                                    </div>
                                `;
                                return this.renderMarkdown(post.body);
                            }}
    
                            ${() => {
                                if(isAdmin) return this.renderHtml`
                                    <div class="editable-area">
                                        <div class="editable-area-header">
                                            <a class="editable-area-button" href="/admin/edit_post_meta?id=${post.id}" target="_overlay">Edit</a>
                                        </div>
                                        <div class="editable-area-body">
                                            <section class="section">
                                                <h3 class="section-title">Meta</h3>
                                                <p><b>Slug:</b> ${post.slug}</p>
                                                <p><b>Tags:</b> ${async () => {
                                                    const tags = await post.tags.all().map(({ name }) => `"${name}"`).join(', ');
                                                    if(tags) return tags;
                                                    return 'none';
                                                }}</p>
                                                <p><b>Featured:</b> ${post.featured ? 'true' : 'false'}</p>
                                                <p><b>Published:</b> ${post.published ? 'true' : 'false'}</p>
                                            </section>
                                        </div>
                                    </div>
    
                                    <section class="section">
                                        <h3 class="section-title">Danger area</h3>
                                        <p>
                                            <button
                                                class="button is-primary"
                                                data-component="pinstripe-anchor"
                                                data-method="post"
                                                data-href="/admin/delete_post?id=${post.id}"
                                                data-target="_overlay"
                                                data-confirm="Are you really sure you want to delete this post?"
                                            >Delete this Post</button>
                                        </p>
                                    </section>
                                `;
                            }}
                            
                        </div>
    
                        <footer class="article-footer canvas">
                            <nav class="navigation">
                                <div class="navigation-previous">
                                    ${() => {
                                        if(previousPost) return this.renderHtml`
                                            <a class="navigation-link" href="/${previousPost.slug}">
                                                <span class="navigation-label">Previous issue</span>
                                                <h4 class="navigation-title">${previousPost.title}</h4>
                                            </a>
                                        `;
                                    }}
                                </div>
    
                                <div class="navigation-middle"></div>
    
                                <div class="navigation-next">
                                    ${() => {
                                        if(nextPost) return this.renderHtml`
                                            <a class="navigation-link" href="/${nextPost.slug}">
                                                <span class="navigation-label">Next issue</span>
                                                <h4 class="navigation-title">${nextPost.title}</h4>
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
    }
};
