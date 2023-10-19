
export default {
    async render(){
        const { params } = this;
        let user;
        if(await this.session){
            user = await this.session.user;
        }
        
        let posts = this.database.posts;
        if(user?.role == 'admin'){
            posts = posts.orderBy('published', 'asc');
        } else {
            posts = posts.where({ published: true });
        }
    
        posts = posts.orderBy('publishedAt', 'desc').orderBy('title', 'asc');
        
        const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        posts = posts.paginate(1, pageSize);
    
        return this.renderView('_layout', {
            body: this.renderView('_section', {
                title: 'Latest posts',
                body: async () => {
                    if(await posts.count() > 0) return this.renderView('_posts', {
                        posts,
                        loadMoreUrl: `/?pageSize=${pageSize + 10}`
                    });
                    return this.renderHtml`
                        Additional posts will be published soon.
                    `;
                }
            })
        });
    }
}

