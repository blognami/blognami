export default {
    meta(){
        this.on('initializeMenus', async function(){
            // Admin-only tag links (shows for admin users when signed in)
            if (await this.isSignedIn && await this.user.role === 'admin') {
                // Add Tag to the Add Content menu
                this.addMenuItem('navbar', 'Add', { 
                    label: 'Tag', 
                    url: '/_actions/admin/add_tag', 
                    target: '_overlay', 
                    testId: 'add-tag' 
                });

                // Add Tag to the Find Content menu
                this.addMenuItem('navbar', 'Find', { 
                    label: 'Tag', 
                    url: '/_actions/admin/find_tag', 
                    target: '_overlay', 
                    testId: 'find-tag' 
                });
            }
        });
    }
};