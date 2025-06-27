
export const styles = `
    .article {
        max-width: 650px;
        margin: 0 auto 0 auto;
    }

    .header {
        margin-bottom: 4rem;
    }
    
    .status-bar {
        margin-bottom: 2rem;
        text-align: right;
    }

    .tag {
        color: var(--accent-color);
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

    .footer {
        padding-top: 3.2rem;
        margin-top: 8rem;
        border-top: 1px solid var(--color-light-gray);
    }

    @media (max-width: 767px) {
        .title {
            font-size: 4.2rem;
        }
    }

    .navigation {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        column-gap: 2.4rem;
        align-items: center;
    }

    .navigation > div {
        display: flex;
        align-items: center;
    }

    .navigation-next {
        justify-content: flex-end;
    }

    .navigation-link {
        display: inline-flex;
        align-items: center;
    }


    .navigation {
        grid-column: wide-start / wide-end;
    }

    .navigation > div {
        align-items: flex-start;
        height: 100%;
    }

    .navigation-link {
        flex-direction: column;
        align-items: flex-start;
    }

    .navigation-next .navigation-link {
        align-items: flex-end;
        text-align: right;
    }

    .navigation-label {
        display: flex;
        align-items: center;
        font-size: 1.7rem;
        font-weight: 700;
        line-height: 1.8;
        text-transform: uppercase;
        letter-spacing: 0.01em;
    }

    .navigation-title {
        margin-top: 0.8rem;
        font-size: 1.6rem;
        font-weight: 400;
        letter-spacing: 0;
    }

    @media (max-width: 767px) {
        .navigation-hide {
            display: none;
        }
    }

    @media (max-width: 767px) {
        .navigation {
            grid-template-columns: 1fr;
            row-gap: 1.6rem;
        }
    }
`;

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
    
        const isAdmin = user?.role == 'admin';

        if(!post.published && !isAdmin) return;

        const meta = [];
        meta.push({ title: post.metaTitle || post.title });
        if(post.metaDescription) meta.push({ name: 'description', content: post.metaDescription });
        
        const userHasAccess = await this.membership.userHasAccessTo(post.access);
    
        return this.renderView('_layout', {
            meta,
            body: this.renderHtml`
                <section>
                    <article class="${this.cssClasses.article}">
                        ${() => {
                            if(!isAdmin) return;
                            
                            if(post.published) return this.renderHtml`
                                <div class="${this.cssClasses.statusBar}">
                                    ${this.renderView('_button', {
                                        tagName: 'a',
                                        href: `/_actions/admin/unpublish_post?id=${post.id}`,
                                        target: '_overlay',
                                        ['data-test-id']: 'unpublish-post',
                                        ['data-method']: 'post',
                                        ['data-confirm']: 'Are you really sure you want to unpublish this post?',
                                        body: 'Unpublish'
                                    })}
                                </div>
                            `;

                            return this.renderHtml`
                                <div class="${this.cssClasses.statusBar}">
                                    ${this.renderView('_button', {
                                        tagName: 'a',
                                        href: `/_actions/admin/publish_post?id=${post.id}`,
                                        target: '_overlay',
                                        ['data-test-id']: 'publish-post',
                                        body: 'Publish'
                                    })}
                                </div>
                            `;
                        }}
                        <header class="${this.cssClasses.header}">
                            <span class="${this.cssClasses.meta}">
                                By <a href="/${postUser.slug}">${postUser.name}</a>
                                
                                ${async () => {
                                    if(await post.tags.count() > 0) return this.renderHtml`
                                        in
                                        ${post.tags.all().map(({ slug, name }, i) => this.renderHtml`${i > 0 ? ', ' : ''}<a class="${this.cssClasses.tag}" href="/${slug}">${name}</a>`)}
                                    `;
                                }}
                                ${() => {
                                    if(post.publishedAt) return this.renderHtml`
                                        —
                                        <time datetime="${this.formatDate(post.publishedAt, 'yyyy-MM-dd')}" data-test-id="post-published-at">${this.formatDate(post.publishedAt)}</time>
                                    `;
                                }}
                            </span>
                            
                            ${() => {
                                if(isAdmin) return this.renderView('_editable_area', {
                                    url: `/_actions/admin/edit_post_title?id=${post.id}`,
                                    body: this.renderHtml`<h1 class="${this.cssClasses.title}" data-test-id="post-title">${post.title}</h1>`,
                                    linkTestId: "edit-post-title"
                                });
                                return this.renderHtml`
                                    <h1 class="${this.cssClasses.title}" data-test-id="post-title">${post.title}</h1>
                                `;
                            }}
    
                        </header>

                        ${() => {
                            if(isAdmin) return this.renderView('_editable_area', {
                                url: `/_actions/admin/edit_post_body?id=${post.id}`,
                                body: this.renderView('_content', {
                                    body: this.renderMarkdown(post.body),
                                    testId: 'post-body'
                                }),
                                linkTestId: "edit-post-body"
                            });
                            if(!userHasAccess) return this.renderView('_subscription_cta', {
                                access: post.access,
                            });
                            return this.renderView('_content', {
                                body: this.renderMarkdown(post.body),
                                testId: 'post-body'
                            });
                        }}
    
                        ${() => {
                            if(isAdmin) return this.renderHtml`
                                ${this.renderView('_edit_tagable_tags', { tagable: post })}

                                ${this.renderView('_editable_area', {
                                    url: `/_actions/admin/edit_post_meta?id=${post.id}`,
                                    body: this.renderHtml`
                                        <p><b>Access:</b> ${post.access}</p>
                                        <p><b>Meta title:</b> ${post.metaTitle}</p>
                                        <p><b>Meta description:</b> ${post.metaDescription}</p>
                                        <p><b>Slug:</b> ${post.slug}</p>
                                        <p><b>Featured:</b> ${post.featured ? 'true' : 'false'}</p>
                                        <p><b>Enable comments:</b> ${post.enableComments ? 'true' : 'false'}</p>
                                    `,
                                    linkTestId: "edit-post-meta",
                                    bodyTestId: "post-meta"
                                })}

                                ${this.renderView('_danger_area', {
                                    body: this.renderView('_button', {
                                        tagName: 'a',
                                        href: `/_actions/admin/delete_post?id=${post.id}`,
                                        target: '_overlay',
                                        isDangerous: true,
                                        isFullWidth: true,
                                        ['data-method']: 'post',
                                        ['data-confirm']: 'Are you really sure you want to delete this post?',
                                        ['data-test-id']: 'delete-post',
                                        body: 'Delete this Post!'
                                    })
                                })}
                            `;
                        }}
                        
                        ${() => {
                            if(userHasAccess && post.enableComments) return this.renderView('_comments', { commentable: post })
                        }}
    
                        <footer class="${this.cssClasses.footer}">
                            <nav class="${this.cssClasses.navigation}">
                                <div class="${this.cssClasses.navigationPrevious}">
                                    ${() => {
                                        if(previousPost) return this.renderHtml`
                                            <a class="${this.cssClasses.navigationLink}" href="/${previousPost.slug}" data-test-id="previous-post">
                                                <span class="${this.cssClasses.navigationLabel}">Previous issue</span>
                                                <h4 class="${this.cssClasses.navigationTitle}">${previousPost.title}</h4>
                                            </a>
                                        `;
                                    }}
                                </div>
    
                                <div class="${this.cssClasses.navigationMiddle}"></div>
    
                                <div class="${this.cssClasses.navigationNext}">
                                    ${() => {
                                        if(nextPost) return this.renderHtml`
                                            <a class="${this.cssClasses.navigationLink}" href="/${nextPost.slug}" data-test-id="next-post">
                                                <span class="${this.cssClasses.navigationLabel}">Next issue</span>
                                                <h4 class="${this.cssClasses.navigationTitle}">${nextPost.title}</h4>
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
