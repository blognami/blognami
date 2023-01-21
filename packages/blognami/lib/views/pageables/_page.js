
export default {
    async render() {
        const { page } = this.params;
        const pageUser = await page.user;
    
        let user;
        if(await this.session){
            user = await this.session.user;
        }
    
        const isSignedIn = user !== undefined;
        const isAdmin = isSignedIn && user.role == 'admin';

        if(!page.published && !isAdmin) return;
    
        return this.renderView('_layout', {
            title: page.title,
            body: this.renderHtml`
                <section class="section">
                    <article class="article">
                        <header class="article-header canvas">
                            <span class="article-meta">
                                By <a href="/${pageUser.slug}">${pageUser.name}</a>
                                —
                                <time datetime="${this.formatDate(page.publishedAt, 'yyyy-MM-dd')}">${this.formatDate(page.publishedAt)}</time>
                            </span>
                            
                            ${() => {
                                if(isAdmin) return this.renderHtml`
                                    <div class="editable-area">
                                        <div class="editable-area-header">
                                            <a class="editable-area-button" href="/admin/edit_page_title?id=${page.id}" target="_overlay">Edit</a>
                                        </div>
                                        <div class="editable-area-body">
                                            <h1 class="article-title">${page.title}</h1>
                                        </div>
                                    </div>
                                `;
                                return this.renderHtml`
                                    <h1 class="article-title">${page.title}</h1>
                                `;
                            }}
    
                        </header>
    
                        <div class="content canvas">
                            ${() => {
                                if(isAdmin) return this.renderHtml`
                                    <div class="editable-area">
                                        <div class="editable-area-header">
                                            <a class="editable-area-button" href="/admin/edit_page_body?id=${page.id}" target="_overlay">Edit</a>
                                        </div>
                                        <div class="editable-area-body content canvas">
                                            ${this.renderMarkdown(page.body)}
                                        </div>
                                    </div>
                                `;
                                return this.renderMarkdown(page.body);
                            }}
    
                            ${() => {
                                if(isAdmin) return this.renderHtml`
                                    <div class="editable-area">
                                        <div class="editable-area-header">
                                            <a class="editable-area-button" href="/admin/edit_page_meta?id=${page.id}" target="_overlay">Edit</a>
                                        </div>
                                        <div class="editable-area-body">
                                            <section class="section">
                                                <h3 class="section-title">Meta</h3>
                                                <p><b>Slug:</b> ${page.slug}</p>
                                                <p><b>Published:</b> ${page.published ? 'true' : 'false'}</p>
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
                                                data-href="/admin/delete_page?id=${page.id}"
                                                data-target="_overlay"
                                                data-confirm="Are you really sure you want to delete this page?"
                                            >Delete this Page</button>
                                        </p>
                                    </section>
                                `;
                            }}
                            
                        </div>
                    </article>
                </section>
            `
        });
    }
};
