
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

        const meta = [];
        meta.push({ title: page.metaTitle || page.title });
        if(page.metaDescription) meta.push({ name: 'description', content: page.metaDescription });

        const userHasAccess = page.access == 'public' || await user?.isSubscribedToNewsletter({ tier: page.access });
    
        return this.renderView('_layout', {
            meta,
            body: this.renderHtml`
                <section>
                    ${this.renderView('_article', {
                        meta: this.renderHtml`
                            By <a href="/${pageUser.slug}">${pageUser.name}</a>
                            —
                            <time datetime="${this.formatDate(page.publishedAt, 'yyyy-MM-dd')}" data-test-id="page-published-at">${this.formatDate(page.publishedAt)}</time>
                        `,
                        title: isAdmin ? this.renderView('_editable_area', {
                            url: `/_actions/admin/edit_page_title?id=${page.id}`,
                            body: this.renderHtml`<span data-test-id="page-title">${page.title}</span>`,
                            linkTestId: "edit-page-title"
                        }) : this.renderHtml`<span data-test-id="page-title">${page.title}</span>`,
                        body: this.renderHtml`
                            ${isAdmin ? this.renderView('_editable_area', {
                                url: `/_actions/admin/edit_page_body?id=${page.id}`,
                                body: this.renderView('_content', {
                                    body: this.renderMarkdown(page.body),
                                    testId: 'page-body'
                                }),
                                linkTestId: "edit-page-body"
                            }) : !userHasAccess ? this.renderView('_subscription_cta', {
                                access: page.access,
                            }) : this.renderView('_content', {
                                body: this.renderMarkdown(page.body),
                                testId: 'page-body'
                            })}

                            ${isAdmin ? this.renderHtml`
                                ${this.renderView('_editable_area', {
                                    url: `/_actions/admin/edit_page_meta?id=${page.id}`,
                                    body: this.renderHtml`
                                        <p><b>Access:</b> ${page.access}</p>
                                        <p><b>Meta title:</b> ${page.metaTitle}</p>
                                        <p><b>Meta description:</b> ${page.metaDescription}</p>
                                        <p><b>Slug:</b> ${page.slug}</p>
                                        <p><b>Published:</b> ${page.published ? 'true' : 'false'}</p>
                                    `,
                                    linkTestId: "edit-page-meta",
                                    bodyTestId: "page-meta"
                                })}

                                ${this.renderView('_danger_area', {
                                    body: this.renderView('_button', {
                                        tagName: 'a',
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
                            ` : ''}
                        `
                    })}
                </section>
            `
        });
    }
};
