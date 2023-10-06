
export default {
    styles: `
        .article {
            max-width: 650px;
            margin: 0 auto 0 auto;
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
    `,

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
    
        return this.renderView('_layout', {
            title: post.title,
            body: this.renderHtml`
                <section>
                    <article class="${this.cssClasses.article}">
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
                                    url: `/admin/edit_post_title?id=${post.id}`,
                                    body: this.renderHtml`<h1 class="${this.cssClasses.title}" data-test-id="post-title">${post.title}</h1>`,
                                    testId: "edit-post-title"
                                });
                                return this.renderHtml`
                                    <h1 class="${this.cssClasses.title}" data-test-id="post-title">${post.title}</h1>
                                `;
                            }}
    
                        </header>

                        ${() => {
                            if(isAdmin) return this.renderView('_editable_area', {
                                url: `/admin/edit_post_body?id=${post.id}`,
                                body: this.renderView('_content', {
                                    body: this.renderMarkdown(post.body),
                                    testId: 'post-body'
                                }),
                                testId: "edit-post-body"
                            });
                            return this.renderView('_content', {
                                body: this.renderMarkdown(post.body),
                                testId: 'post-body'
                            });
                        }}
    
                        ${() => {
                            if(isAdmin) return this.renderHtml`
                                ${this.renderView('_editable_area', {
                                    url: `/admin/edit_post_meta?id=${post.id}`,
                                    body: this.renderView('_section', {
                                        title: 'Meta',
                                        level: 3,
                                        testId: 'post-meta',
                                        body: this.renderHtml`
                                            <p><b>Slug:</b> ${post.slug}</p>
                                            <p><b>Tags:</b> ${async () => {
                                                const tags = await post.tags.all().map(({ name }) => `"${name}"`).join(', ');
                                                if(tags) return tags;
                                                return 'none';
                                            }}</p>
                                            <p><b>Featured:</b> ${post.featured ? 'true' : 'false'}</p>
                                            <p><b>Published:</b> ${post.published ? 'true' : 'false'}</p>
                                            <p><b>enableComments:</b> ${post.enableComments ? 'true' : 'false'}</p>
                                        `
                                    }),
                                    testId: "edit-post-meta"
                                })}

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
                                                data-href="/admin/delete_post?id=${post.id}"
                                                data-target="_overlay"
                                                data-confirm="Are you really sure you want to delete this post?"
                                                data-test-id="delete-post"
                                            >Delete this Post</button>
                                        </p>
                                    `
                                })}
                            `;
                        }}
                        
                        ${() => {
                            if(post.enableComments) return this.renderView('_comments', { commentable: post })
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
