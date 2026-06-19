
export const styles = ({ colors, breakpointFor, remify }) => `
    .status-bar {
        margin-bottom: ${remify(20)};
        text-align: right;
    }

    .navigation {
        padding-top: ${remify(32)};
        margin-top: ${remify(80)};
        border-top: ${remify(1)} solid ${colors.gray[200]};
        display: grid;
        grid-template-columns: 1fr;
        row-gap: ${remify(16)};
        align-items: center;
        grid-column: wide-start / wide-end;
    }

    .navigation > div {
        display: flex;
        align-items: flex-start;
        height: 100%;
    }

    .navigation-next {
        justify-content: flex-end;
    }

    .navigation-link {
        display: inline-flex;
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
        font-size: ${remify(17)};
        font-weight: 700;
        line-height: 1.8;
        text-transform: uppercase;
        letter-spacing: 0.01em;
    }

    .navigation-title {
        margin-top: ${remify(8)};
        font-size: ${remify(16)};
        font-weight: 400;
        letter-spacing: 0;
    }

    .navigation-hide {
        display: none;
    }

    ${breakpointFor('md')} {
        .navigation {
            grid-template-columns: 1fr auto 1fr;
            column-gap: ${remify(24)};
            row-gap: 0;
        }

        .navigation-hide {
            display: block;
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

        const userHasAccess = post.access == 'public' || await this.database.newsletter.isSubscribed(user, { tier: post.access });

        return this.renderView('_layout', {
            meta,
            body: this.renderHtml`
                <section>
                    ${() => {
                        if(!isAdmin) return;

                        return this.renderHtml`
                            <div class="${this.cssClasses.statusBar}">
                                ${() => {
                                    if(post.published) return this.renderView('_button', {
                                        tagName: 'a',
                                        href: `/_actions/admin/unpublish_post?id=${post.id}`,
                                        target: '_overlay',
                                        ['data-test-id']: 'unpublish-post',
                                        ['data-method']: 'post',
                                        ['data-confirm']: 'Are you really sure you want to unpublish this post?',
                                        body: 'Unpublish'
                                    });

                                    return this.renderView('_button', {
                                        tagName: 'a',
                                        href: `/_actions/admin/publish_post?id=${post.id}`,
                                        target: '_overlay',
                                        ['data-test-id']: 'publish-post',
                                        body: 'Publish'
                                    });
                                }}
                            </div>
                        `;
                    }}

                    ${this.renderView('_meta_bar', {
                        body: this.renderHtml`
                            By <a href="/${postUser.slug}" data-placeholder="/_placeholders/user">${postUser.name}</a>

                            ${async () => {
                                if(await post.tags.count() > 0) return this.renderHtml`
                                    in
                                    ${post.tags.all().map(({ slug, name }, i) => this.renderHtml`${i > 0 ? ', ' : ''}<a href="/${slug}" data-placeholder="/_placeholders/tag"><em>${name}</em></a>`)}
                                `;
                            }}
                            ${(() => {
                                if(post.publishedAt) return this.renderHtml`
                                    —
                                    <time datetime="${this.formatDate(post.publishedAt, 'yyyy-MM-dd')}" data-test-id="post-published-at">${this.formatDate(post.publishedAt)}</time>
                                `;
                            })()}
                        `
                    })}

                    ${() => {
                        const title = this.renderHtml`<h1 data-test-id="post-title">${post.title}</h1>`;
                        const body = this.renderHtml`<div data-test-id="post-body">${this.renderMarkdown(post.body)}</div>`;

                        if(isAdmin) return this.renderHtml`
                            <div>
                                ${this.renderView('_editable_area', {
                                    url: `/_actions/admin/edit_post_title?id=${post.id}`,
                                    body: this.renderView('_content', { body: title }),
                                    linkTestId: "edit-post-title"
                                })}
                                ${this.renderView('_tabs', {
                                    tabs: [
                                        {
                                            title: 'Body',
                                            testId: 'tab-body',
                                            body: this.renderView('_editable_area', {
                                                url: `/_actions/admin/edit_post_body?id=${post.id}`,
                                                body: this.renderView('_content', { body }),
                                                linkTestId: "edit-post-body"
                                            })
                                        },
                                        {
                                            title: 'Tags',
                                            testId: 'tab-tags',
                                            body: this.renderView('_edit_tagable_tags', { tagable: post })
                                        },
                                        {
                                            title: 'Meta',
                                            testId: 'tab-meta',
                                            body: this.renderView('_editable_area', {
                                                url: `/_actions/admin/edit_post_meta?id=${post.id}`,
                                                body: this.renderHtml`
                                                    <p><b>Access:</b> ${post.access}</p>
                                                    <p><b>Meta title:</b> ${post.metaTitle}</p>
                                                    <p><b>Meta description:</b> ${post.metaDescription}</p>
                                                    <p><b>Slug:</b> ${post.slug}</p>
                                                    <p><b>Enable comments:</b> ${post.enableComments ? 'true' : 'false'}</p>
                                                `,
                                                linkTestId: "edit-post-meta",
                                                bodyTestId: "post-meta"
                                            })
                                        },
                                        {
                                            title: 'Danger',
                                            testId: 'tab-danger',
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
                                        }
                                    ]
                                })}
                            </div>
                        `;

                        if(!userHasAccess) return this.renderView('_content', {
                            body: this.renderHtml`
                                ${title}
                                ${this.renderView('_subscription_cta', { access: post.access })}
                            `
                        });

                        return this.renderView('_content', {
                            body: this.renderHtml`
                                ${title}
                                ${body}
                            `
                        });
                    }}
                    
                    ${async () => {
                        if(!userHasAccess || !post.enableComments) return;
                        const { commentId, commentPageSize } = this.params;
                        if(commentId){
                            const comment = await this.database.comments.where({ id: commentId }).first();
                            if(comment && (await comment.rootCommentable).id == post.id) return this.renderView('_comments', { commentable: comment, pageSize: commentPageSize });
                        }
                        return this.renderView('_comments', { commentable: post, pageSize: commentPageSize });
                    }}
                
                    <nav class="${this.cssClasses.navigation}">
                        <div class="${this.cssClasses.navigationPrevious}">
                            ${(() => {
                                if(previousPost) return this.renderHtml`
                                    <a class="${this.cssClasses.navigationLink}" href="/${previousPost.slug}" data-placeholder="/_placeholders/post" data-test-id="previous-post">
                                        <span class="${this.cssClasses.navigationLabel}">Previous post</span>
                                        <h4 class="${this.cssClasses.navigationTitle}">${previousPost.title}</h4>
                                    </a>
                                `;
                            })()}
                        </div>

                        <div class="${this.cssClasses.navigationMiddle}"></div>

                        <div class="${this.cssClasses.navigationNext}">
                            ${(() => {
                                if(nextPost) return this.renderHtml`
                                    <a class="${this.cssClasses.navigationLink}" href="/${nextPost.slug}" data-placeholder="/_placeholders/post" data-test-id="next-post">
                                        <span class="${this.cssClasses.navigationLabel}">Next post</span>
                                        <h4 class="${this.cssClasses.navigationTitle}">${nextPost.title}</h4>
                                    </a>
                                `;
                            })()}
                        </div>
                    </nav>
                </section>
            `
        });
    }
};
