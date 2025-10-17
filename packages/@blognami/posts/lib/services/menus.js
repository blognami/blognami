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

            this.addMenuItem('sidebar', { label: 'Featured', partial: '_sidebar/_featured_posts_section' });
            this.addMenuItem('sidebar', { label: 'Tags', partial: '_sidebar/_tags_section' });
        });
    }
};