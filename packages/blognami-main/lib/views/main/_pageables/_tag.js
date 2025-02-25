
export default {
    async render(){
        const { tag, ...params } = this.params;
        let user;
        if(await this.session){
            user = await this.session.user;
        }
        
        const isAdmin = user?.role == 'admin';
        let posts = this.database.posts.where({ tags: { name: tag.name } });
        if(isAdmin){
            posts = posts.orderBy('published', 'asc')
        } else {
            posts = posts.where({ published: true });
        }
        posts = posts.orderBy('publishedAt', 'desc').orderBy('title', 'asc');
    
        const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        
        posts = posts.paginate(1, pageSize);
        
        const meta = [];
        meta.push({ title: tag.metaTitle || tag.name });
        if(tag.metaDescription) meta.push({ name: 'description', content: tag.metaDescription });
    
        return this.renderView('_layout', {
            meta,
            body: this.renderView('_section', {
                title: `Latest posts tagged "${tag.name}"`,
                body: this.renderHtml`
                    ${async () => {
                        if(await posts.count() > 0) return this.renderView('_posts', {
                            posts,
                            loadMoreUrl: `?pageSize=${pageSize + 10}`
                        });
                        return this.renderHtml`
                            Additional posts will be published soon.
                        `;
                    }}

                    ${() => {
                        if(isAdmin) return this.renderHtml`
                            ${this.renderView('_editable_area', {
                                url: `/_actions/admin/edit_tag_meta?id=${tag.id}`,
                                body: this.renderHtml`
                                    <p><b>Name:</b> ${tag.name}</p>
                                    <p><b>Meta title:</b> ${tag.metaTitle}</p>
                                    <p><b>Meta description:</b> ${tag.metaDescription}</p>
                                    <p><b>Slug:</b> ${tag.slug}</p>
                                `,
                                linkTestId: "edit-tag-meta",
                                bodyTestId: "tag-meta"
                            })}
    
                            ${this.renderView('_danger_area', {
                                body: this.renderView('_button', {
                                    tagName: 'a',
                                    href: `/_actions/admin/delete_tag?id=${tag.id}`,
                                    target: '_overlay',
                                    isDangerous: true,
                                    isFullWidth: true,
                                    ['data-method']: 'post',
                                    ['data-confirm']: 'Are you really sure you want to delete this tag?',
                                    ['data-test-id']: 'delete-tag',
                                    body: 'Delete this Tag!'
                                })
                            })}
                        `;
                    }}
                `
            })
        });
    }
};
