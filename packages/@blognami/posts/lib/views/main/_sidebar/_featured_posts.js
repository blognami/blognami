
export default {
    async render(){
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

        if(await featuredPosts.count() > 0) return this.renderView('_section', {
            title: 'Featured',
            level: 3,
            testId: 'featured-section',
            body: this.renderView('_posts', { posts: featuredPosts, compact: true })
        });
    }
};
