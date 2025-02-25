
export default {
    async render(){
        const { params } = this;
        let user;
        if(await this.session){
            user = await this.session.user;
        }

        const isAdmin = user?.role == 'admin';
        
        let posts = this.database.posts;
        if(user?.role == 'admin'){
            posts = posts.orderBy('published', 'asc');
        } else {
            posts = posts.where({ published: true });
        }
    
        posts = posts.orderBy('publishedAt', 'desc').orderBy('title', 'asc');
        
        const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        posts = posts.paginate(1, pageSize);

        const home = await this.database.home;

        const meta = [];
        meta.push({ title: home.metaTitle || await this.database.site.title });
        if(home.metaDescription) meta.push({ name: 'description', content: home.metaDescription });
    
        return this.renderView('_layout', {
            meta,
            body: this.renderView('_section', {
                title: 'Latest posts',
                body: this.renderHtml`
                    ${async () => {
                        if(await posts.count() > 0) return this.renderView('_posts', {
                            posts,
                            loadMoreUrl: `/?pageSize=${pageSize + 10}`
                        });
                        return this.renderHtml`
                            Additional posts will be published soon.
                        `;
                    }}
                    ${() => {
                        if(isAdmin) return this.renderView('_editable_area', {
                            url: `/_actions/admin/edit_home_meta`,
                            body: this.renderHtml`
                                <p><b>Meta title:</b> ${home.metaTitle}</p>
                                <p><b>Meta description:</b> ${home.metaDescription}</p>
                            `,
                            linkTestId: "edit-home-meta",
                            bodyTestId: "home-meta"
                        })
                    }}
                `
            })
        });
    }
}

