
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

        const userHasAccess = page.access == 'public' || await this.database.newsletter.isSubscribed(user, { tier: page.access });
    
        return this.renderView('_layout', {
            meta,
            body: this.renderHtml`
                <section>
                    ${this.renderView('_meta_bar', {
                        body: this.renderHtml`
                            By <a href="/${pageUser.slug}" data-placeholder="/_placeholders/user">${pageUser.name}</a>
                            —
                            <time datetime="${this.formatDate(page.publishedAt, 'yyyy-MM-dd')}" data-test-id="page-published-at">${this.formatDate(page.publishedAt)}</time>
                        `
                    })}

                    ${() => {
                        const title = this.renderHtml`<h1 data-test-id="page-title">${page.title}</h1>`;
                        const body = this.renderHtml`<div data-test-id="page-body">${this.renderMarkdown(page.body)}</div>`;

                        if(isAdmin) return this.renderHtml`
                            <div>
                                ${this.renderView('_editable_area', {
                                    url: `/_actions/admin/edit_page_title?id=${page.id}`,
                                    body: this.renderView('_content', { body: title }),
                                    linkTestId: "edit-page-title"
                                })}
                                ${this.renderView('_tabs', {
                                    tabs: [
                                        {
                                            title: 'Body',
                                            testId: 'tab-body',
                                            body: this.renderView('_editable_area', {
                                                url: `/_actions/admin/edit_page_body?id=${page.id}`,
                                                body: this.renderView('_content', { body }),
                                                linkTestId: "edit-page-body"
                                            })
                                        },
                                        {
                                            title: 'Meta',
                                            testId: 'tab-meta',
                                            body: this.renderView('_editable_area', {
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
                                            })
                                        },
                                        {
                                            title: 'Danger',
                                            testId: 'tab-danger',
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
                                        }
                                    ]
                                })}
                            </div>
                        `;

                        if(!userHasAccess) return this.renderHtml`
                            ${this.renderView('_content', { body: title })}
                            ${this.renderView('_subscription_cta', { access: page.access, noun: 'page', withheld: true })}
                        `;

                        return this.renderView('_content', {
                            body: this.renderHtml`
                                ${title}
                                ${body}
                            `
                        });
                    }}
                </section>
            `
        });
    }
};
