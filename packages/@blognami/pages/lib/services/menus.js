export default {
    meta(){
        this.on('initializeMenus', async function(){
            // Admin-only page links (shows for admin users when signed in)
            if (await this.isSignedIn && await this.user.role === 'admin') {
                // Add Page to the Add Content menu
                this.addMenuItem('navbar', 'Add', { 
                    label: 'Page', 
                    url: '/_actions/admin/add_page', 
                    target: '_overlay', 
                    testId: 'add-page' 
                });

                // Add Page to the Find Content menu
                this.addMenuItem('navbar', 'Find', { 
                    label: 'Page', 
                    url: '/_actions/admin/find_page', 
                    target: '_overlay', 
                    testId: 'find-page' 
                });
            }
        });
    }
};