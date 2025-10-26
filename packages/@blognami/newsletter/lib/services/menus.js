export default {
    meta(){
        this.addHook('initializeMenus', async function(){
            // Admin-only Newsletter Settings (shows for admin users when signed in)
            if (await this.isSignedIn && await this.user.role === 'admin') {
                // Add Newsletter settings to navbar Settings menu
                this.addMenuItem('navbar', 'Settings', { 
                    label: 'Newsletter', 
                    url: '/_actions/admin/edit_newsletter', 
                    target: '_overlay', 
                    testId: 'edit-site-membership' 
                });

                // Add Newsletter settings to burger menu Settings
                this.addMenuItem('burgerMenu', 'Account', 'Settings', { 
                    label: 'Newsletter', 
                    url: '/_actions/admin/edit_newsletter', 
                    target: '_overlay', 
                    testId: 'edit-site-membership' 
                });
            }
        });
    }
};