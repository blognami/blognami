
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
        posts = posts.orderBy('publishedAt', 'desc');
    
        const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        
        posts = posts.paginate(1, pageSize);
    
        return this.renderView('_layout', {
            title: user.name,
            body: this.renderHtml`
                <section class="section">
                    <h2 class="section-title">Latest posts by "${user.name}"</h2>
    
                    <div class="feed">
                        ${this.renderView('_posts', { posts })}
                    </div>
    
                    ${async () => {
                        if(await posts.count() == 0) return this.renderHtml`
                            Additional posts will be published soon.
                        `;
                    }}
    
                    ${async () => {
                        if(await posts.all().length < await posts.count()) return this.renderHtml`
                            <button class="feed-loadmore btn" data-component="a" data-method="post" data-href="?pageSize=${pageSize + 10}">Load more posts</button>
                        `;
                    }}
                </section>
            `
        });
    }
};
