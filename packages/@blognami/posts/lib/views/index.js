
export default {
    meta(){
        this.addHook('renderBody', async function(){
            const { params } = this;
            let user;
            if(await this.session){
                user = await this.session.user;
            }

            const isAdmin = user?.role == 'admin';
            
            let posts = this.database.posts;
            if(isAdmin){
                posts = posts.orderBy('published', 'asc');
            } else {
                posts = posts.where({ published: true });
            }
        
            posts = posts.orderBy('publishedAt', 'desc').orderBy('title', 'asc');
            
            const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
            posts = posts.paginate(1, pageSize);
        
            return this.renderView('_section', {
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
                `
            });
        });
    }
};