
export const styles = ({ colors, breakpointFor, remify }) => `
    .status-bar {
        margin-bottom: ${remify(20)};
        text-align: right;
    }

    .featured-image {
        display: block;
        width: 100%;
        aspect-ratio: 16 / 9;
        object-fit: cover;
        margin-bottom: ${remify(20)};
    }

    .meta-featured-image {
        width: ${remify(64)};
        height: ${remify(36)};
        object-fit: cover;
        vertical-align: middle;
    }

    .byline-blog {
        display: inline-flex;
        align-items: center;
        gap: ${remify(6)};
        vertical-align: middle;
    }

    .byline-logo {
        width: ${remify(20)};
        height: ${remify(20)};
        border-radius: 50%;
        object-fit: cover;
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

        const logoImage = await this.database.site.logoImage;

        const featuredImage = await post.featuredImage;

        const siteTitle = await this.database.site.title;

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
        if(featuredImage){
            const content = new URL(`/${featuredImage.slug}`, this.initialParams._url).href;
            meta.push({ property: 'og:image', content });
            meta.push({ name: 'twitter:image', content });
            meta.push({ name: 'twitter:card', content: 'summary_large_image' });
        }

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

                    ${(() => {
                        if(featuredImage) return this.renderHtml`
                            <img class="${this.cssClasses.featuredImage}" src="/${featuredImage.slug}" alt="" data-test-id="post-featured-image">
                        `;
                    })()}

                    ${this.renderView('_meta_bar', {
                        body: this.renderHtml`
                            ${(() => {
                                if(logoImage) return this.renderHtml`
                                    <a class="${this.cssClasses.bylineBlog}" href="/" data-test-id="post-byline-blog"><img class="${this.cssClasses.bylineLogo}" src="/${logoImage.slug}" alt="${siteTitle}" data-test-id="post-byline-logo"> ${siteTitle}</a> ·
                                `;
                            })()}
                            By <a href="/${postUser.slug}">${postUser.name}</a>

                            ${async () => {
                                if(await post.tags.count() > 0) return this.renderHtml`
                                    in
                                    ${post.tags.all().map(({ slug, name }, i) => this.renderHtml`${i > 0 ? ', ' : ''}<a href="/${slug}"><em>${name}</em></a>`)}
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
                                                    <p><b>Featured image:</b> ${featuredImage ? this.renderHtml`<img class="${this.cssClasses.metaFeaturedImage}" src="/${featuredImage.slug}" alt="" data-test-id="post-meta-featured-image">` : 'none'}</p>
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

                        if(!userHasAccess) return this.renderHtml`
                            ${this.renderView('_content', { body: title })}
                            ${this.renderView('_subscription_cta', { access: post.access, withheld: true })}
                        `;

                        return this.renderHtml`
                            ${this.renderView('_content', { body: this.renderHtml`${title}${body}` })}
                            ${this.renderView('_subscription_cta', { access: post.access })}
                        `;
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
                                    <a class="${this.cssClasses.navigationLink}" href="/${previousPost.slug}" data-test-id="previous-post">
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
                                    <a class="${this.cssClasses.navigationLink}" href="/${nextPost.slug}" data-test-id="next-post">
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
