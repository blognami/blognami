
export default {

    styles: `
        .article {
            max-width: 650px;
            margin: 0 auto 0 auto;
        }
    
        .meta {
            display: block;
            margin-bottom: 2rem;
            font-size: 1.2rem;
            font-weight: 500;
            line-height: 1;
            color: var(--color-secondary-text);
            text-transform: uppercase;
        }
        
        .meta a {
            font-weight: 600;
        }
        
        .title {
            font-size: 7.4rem;
            font-weight: 600;
            line-height: 1;
        }
        
        @media (max-width: 767px) {
            .title {
                font-size: 4.2rem;
            }
        }
    `,

    async render() {
        const { page } = this.params;
        const pageUser = await page.user;
    
        let user;
        if(await this.session){
            user = await this.session.user;
        }
    
        const isAdmin = user?.role == 'admin';

        if(!page.published && !isAdmin) return;
    
        return this.renderView('_layout', {
            title: page.title,
            body: this.renderHtml`
                <section>
                    <article class="${this.cssClasses.article}">
                        <header class="${this.cssClasses.header}">
                            <span class="${this.cssClasses.meta}">
                                By <a href="/${pageUser.slug}">${pageUser.name}</a>
                                —
                                <time datetime="${this.formatDate(page.publishedAt, 'yyyy-MM-dd')}" data-test-id="page-published-at">${this.formatDate(page.publishedAt)}</time>
                            </span>
                            
                            ${() => {
                                if(isAdmin) return this.renderView('_editable_area', {
                                    url: `/admin/edit_page_title?id=${page.id}`,
                                    body: this.renderHtml`<h1 class="${this.cssClasses.title}" data-test-id="page-title">${page.title}</h1>`,
                                    testId: "edit-page-title"
                                });
                                return this.renderHtml`
                                    <h1 class="${this.cssClasses.title}" data-test-id="page-title">${page.title}</h1>
                                `;
                            }}
    
                        </header>
                        
                        ${() => {
                            if(isAdmin) return this.renderView('_editable_area', {
                                url: `/admin/edit_page_body?id=${page.id}`,
                                body: this.renderView('_content', {
                                    body: this.renderMarkdown(page.body),
                                    testId: 'page-body'
                                }),
                                testId: "edit-page-body"
                            });
                            return this.renderView('_content', {
                                body: this.renderMarkdown(page.body),
                                testId: 'page-body'
                            });
                        }}
    
                        ${() => {
                            if(isAdmin) return this.renderHtml`
                                ${
                                    this.renderView('_editable_area', {
                                        url: `/admin/edit_page_meta?id=${page.id}`,
                                        body: this.renderView('_section', {
                                            title: 'Meta',
                                            level: 3,
                                            testId: 'page-meta',
                                            body: this.renderHtml`
                                                <p><b>Slug:</b> ${page.slug}</p>
                                                <p><b>Published:</b> ${page.published ? 'true' : 'false'}</p>
                                            `
                                        }),
                                        testId: "edit-page-meta"
                                    })
                                }

                                ${this.renderView('_section', {
                                    title: 'Danger area',
                                    level: 3,
                                    testId: 'danger-area',
                                    body: this.renderHtml`
                                        <p>
                                            <button
                                                class="button is-primary"
                                                data-component="pinstripe-anchor"
                                                data-method="post"
                                                data-href="/admin/delete_page?id=${page.id}"
                                                data-target="_overlay"
                                                data-confirm="Are you really sure you want to delete this page?"
                                                data-test-id="delete-page"
                                            >Delete this Page</button>
                                        </p>
                                    `
                                })}
                            `;
                        }}
                            
                    </article>
                </section>
            `
        });
    }
};
