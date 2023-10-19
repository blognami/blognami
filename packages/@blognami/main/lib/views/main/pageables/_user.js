
export default {
    async render(){
        const { user, ...params } = this.params;
        let sessionUser;
        if(await this.session){
            sessionUser = await this.session.user;
        }
        
        const isAdmin = sessionUser?.role == 'admin';
        let posts = user.posts;
        if(isAdmin){
            posts = posts.orderBy('published', 'asc')
        } else {
            posts = posts.where({ published: true });
        }
        posts = posts.orderBy('publishedAt', 'desc').orderBy('title', 'asc');
    
        const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        
        posts = posts.paginate(1, pageSize);
    
        return this.renderView('_layout', {
            title: user.name,
            body: this.renderView('_section', {
                title: `Latest posts by "${user.name}"`,
                body: async () => {
                    if(await posts.count() > 0) return this.renderView('_posts', {
                        posts,
                        loadMoreUrl: `?pageSize=${pageSize + 10}`
                    });
                    return this.renderHtml`
                        Additional posts will be published soon.
                    `;
                }
            })
        });
    }
};
