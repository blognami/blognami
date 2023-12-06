
export const styles = `
    .tags-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .tags-item + .tags-item {
        margin-top: 1.6rem;
    }

    .tags-name {
        font-size: 1.7rem;
        font-weight: 600;
        letter-spacing: 0;
    }

    .tags-count {
        padding: 0.4rem 0.8rem;
        font-size: 1.3rem;
        line-height: 1;
        border: 1px solid var(--color-light-gray);
        border-radius: 32px;
    }
`;

export default {
    async render(){
        const { params } = this;
    
        let user;
        if(await this.session){
            user = await this.session.user;
        }

        const isAdmin = user?.role == 'admin';
        
        let posts = this.database.posts;
        if(isAdmin){
            posts = posts.orderBy('published', 'asc')
        } else {
            posts = posts.where({ published: true });
        }
    
        posts = posts.orderBy('publishedAt', 'desc');
    
        const featuredPosts = posts.where({ featured: true });
        
        const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        posts = posts.paginate(1, pageSize);
    
        const tags = this.database.posts.tags.orderBy('name');
    
        const site = await this.database.site;

        return this.renderHtml`
            ${this.renderView('_section', {
                title: 'About',
                testId: 'about-section',
                body: async () => {
                    if(isAdmin) return this.renderView('_editable_area', {
                        url: "/_actions/admin/edit_site_description",
                        body: this.renderMarkdown(await site.description)
                    });
                    return this.renderMarkdown(await site.description)
                }
            })}

            ${async () => {
                if(await featuredPosts.count() > 0) return this.renderView('_section', {
                    title: 'Featured',
                    level: 3,
                    testId: 'featured-section',
                    body: this.renderView('_posts', { posts: featuredPosts, compact: true })
                });
            }}

            ${async () => {
                if(await tags.count() > 0) return this.renderView('_section', {
                    title: 'Tags',
                    level: 3,
                    testId: 'tags-section',
                    body: tags.all().map(({ name, slug }) => this.renderHtml`
                        <a class="${this.cssClasses.tagsItem}" href="/${slug}">
                            <h4 class="${this.cssClasses.tagsName}">${name}</h4>
                            <span class="${this.cssClasses.tagsCount}">
                                ${async () => {
                                    const count = await this.database.posts.where({ taggedWith: name }).count();
                                    if(count == 1) return this.renderHtml`
                                        ${count} post
                                    `;

                                    return this.renderHtml`
                                        ${count} posts
                                    `;
                                }}
                            </span>
                        </a>
                    `)
                });
            }}
        `;
    }
};
