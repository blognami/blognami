export default {
    meta(){
        this.on('initializeMenus', async function(){
            // Admin-only post links (shows for admin users when signed in)
            if (await this.isSignedIn && await this.user.role === 'admin') {
                // Add Post to the Add Content menu
                this.addMenuItem('navbar', 'Add', { 
                    label: 'Post', 
                    url: '/_actions/admin/add_post', 
                    target: '_overlay', 
                    testId: 'add-post' 
                });

                // Add Post to the Find Content menu
                this.addMenuItem('navbar', 'Find', { 
                    label: 'Post', 
                    url: '/_actions/admin/find_post', 
                    target: '_overlay', 
                    testId: 'find-post' 
                });
            }

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
        
            const featuredPosts = await posts.where({ featured: true }).all();
            
            for (const post of featuredPosts) {
                this.addMenuItem('sidebar', 'Featured', { label: post.title, url: `/${post.slug}` });
            }
            
            // Add individual tags with post count badges
            const tags = await this.database.posts.tags.orderBy('name').all();
            
            for (const tag of tags) {
                const count = await this.database.posts.where({ tags: { name: tag.name } }).count();
                const badgeText = count === 1 ? '1 post' : `${count} posts`;
                
                this.addMenuItem('sidebar', 'Tags', { 
                    label: tag.name, 
                    url: `/${tag.slug}`,
                    badge: badgeText
                });
            }
        });
    }
};