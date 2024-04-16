
export const styles = `
    .article {
        max-width: 650px;
        margin: 0 auto 0 auto;
    }

    .header {
        margin-bottom: 4rem;
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
`;

export default {
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
                                    url: `/_actions/admin/edit_page_title?id=${page.id}`,
                                    body: this.renderHtml`<h1 class="${this.cssClasses.title}" data-test-id="page-title">${page.title}</h1>`,
                                    linkTestId: "edit-page-title"
                                });
                                return this.renderHtml`
                                    <h1 class="${this.cssClasses.title}" data-test-id="page-title">${page.title}</h1>
                                `;
                            }}
    
                        </header>
                        
                        ${() => {
                            if(isAdmin) return this.renderView('_editable_area', {
                                url: `/_actions/admin/edit_page_body?id=${page.id}`,
                                body: this.renderView('_content', {
                                    body: this.renderMarkdown(page.body),
                                    testId: 'page-body'
                                }),
                                linkTestId: "edit-page-body"
                            });
                            return this.renderView('_content', {
                                body: this.renderMarkdown(page.body),
                                testId: 'page-body'
                            });
                        }}
    
                        ${() => {
                            if(isAdmin) return this.renderHtml`
                                ${this.renderView('_editable_area', {
                                    url: `/_actions/admin/edit_page_meta?id=${page.id}`,
                                    body: this.renderHtml`
                                        <p><b>Slug:</b> ${page.slug}</p>
                                        <p><b>Published:</b> ${page.published ? 'true' : 'false'}</p>
                                    `,
                                    linkTestId: "edit-page-meta",
                                    bodyTestId: "page-meta"
                                })}

                                ${this.renderView('_danger_area', {
                                    body: this.renderView('_button', {
                                        nodeName: 'a',
                                        href: `/_actions/admin/delete_page?id=${page.id}`,
                                        target: '_overlay',
                                        isDangerous: true,
                                        isFullWidth: true,
                                        ['data-method']: 'post',
                                        ['data-confirm']: 'Are you really sure you want to delete this page?',
                                        ['data-test-id']: 'delete-page',
                                        body: 'Delete this Page!'
                                    })
                                })}
                            `;
                        }}
                            
                    </article>
                </section>
            `
        });
    }
};
