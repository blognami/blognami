
export default {
    async render(){
        const { params } = this;
        let user;
        if(await this.session){
            user = await this.session.user;
        }
    
        const isSignedIn = user !== undefined;
        
        let posts = this.database.posts;
        if(isSignedIn){
            posts = posts.orderBy('published', 'asc')
        } else {
            posts = posts.where({ published: true });
        }
    
        posts = posts.orderBy('publishedAt', 'desc');
        
        const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
        posts = posts.paginate(1, pageSize);
    
        return this.renderView('_layout', {
            body: this.renderHtml`
                <section class="section">
                    <h2 class="section-title">Latest posts</h2>
    
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
                            <button class="feed-loadmore btn" data-component="pinstripe-anchor" data-method="post" data-href="/?pageSize=${pageSize + 10}">Load more posts</button>
                        `;
                    }}
                </section>
            `
        });
    }
}

