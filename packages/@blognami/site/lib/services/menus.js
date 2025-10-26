export default {
    meta(){
        this.addHook('initializeMenus', async function(){
            // Admin-only Site Settings (shows for admin users when signed in)
            if (await this.isSignedIn && await this.user.role === 'admin') {
                // Site settings in Settings menu
                this.addMenuItem('navbar', 'Settings', { 
                    label: 'Site', 
                    url: '/_actions/admin/edit_site_meta', 
                    target: '_overlay', 
                    testId: 'edit-site-meta' 
                });

                // Site settings in burger menu Settings
                this.addMenuItem('burgerMenu', 'Account', 'Settings', { 
                    label: 'Site', 
                    url: '/_actions/admin/edit_site_meta', 
                    target: '_overlay', 
                    testId: 'edit-site-meta' 
                });
            }

            // Legal footer menu items
            this.addMenuItem('footer', 'Legal', { label: 'Terms of Service', url: '/legal/terms-of-service' });
            this.addMenuItem('footer', 'Legal', { label: 'Privacy Policy', url: '/legal/privacy-policy' });
            this.addMenuItem('footer', 'Legal', { label: 'Cookie Policy', url: '/legal/cookie-policy' });
        });
    }
};