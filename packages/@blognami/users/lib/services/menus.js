export default {
    meta(){
        this.addHook('initializeMenus', async function(){
            // Sign In link (shows when signed out)
            if (await this.isSignedOut) {
                this.addMenuItem('navbar', { 
                    label: 'Sign in', 
                    url: '/_actions/guest/sign_in', 
                    target: '_overlay',
                    displayOrder: 1000,
                    preload: true,
                    testId: 'sign-in'
                });
            }

            // Admin-only user links (shows for admin users when signed in)
            if (await this.isSignedIn && await this.user.role === 'admin') {
                // Add User to the Add Content menu
                this.addMenuItem('navbar', 'Add', { 
                    label: 'User', 
                    url: '/_actions/admin/add_user', 
                    target: '_overlay', 
                    testId: 'add-user' 
                });

                // Add User to the Find Content menu
                this.addMenuItem('navbar', 'Find', { 
                    label: 'User', 
                    url: '/_actions/admin/find_user', 
                    target: '_overlay', 
                    testId: 'find-user' 
                });

                // Add corresponding burger menu items under Account section
                this.addMenuItem('burgerMenu', 'Account', 'Add', { 
                    label: 'User', 
                    url: '/_actions/admin/add_user', 
                    target: '_overlay', 
                    testId: 'add-user' 
                });

                this.addMenuItem('burgerMenu', 'Account', 'Find', { 
                    label: 'User', 
                    url: '/_actions/admin/find_user', 
                    target: '_overlay', 
                    testId: 'find-user' 
                });
            }

            // Your Account menu (shows for any signed in user)
            if (await this.isSignedIn) {
                const user = await this.user;

                this.addMenuItem('navbar', {
                    label: user.name,
                    testId: 'your-account',
                    displayOrder: 300
                });
                
                this.addMenuItem('navbar', user.name, { 
                    label: 'Profile', 
                    url: `/${await this.user.slug}`, 
                    target: '_top',
                    testId: 'profile'
                });

                // Notification preferences
                this.addMenuItem('navbar', user.name, { 
                    label: 'Notification preferences', 
                    url: '/_actions/user/edit_user_notification_preferences', 
                    target: '_overlay',
                    testId: 'edit-user-notification-preferences'
                });



                this.addMenuItem('navbar', user.name, { 
                    label: 'Sign out', 
                    url: '/_actions/guest/sign_out', 
                    target: '_overlay',
                    displayOrder: 200,
                    testId: 'sign-out'
                });

                // Burger menu equivalents
                this.addMenuItem('burgerMenu', 'Account', {
                    label: user.name,
                    testId: 'your-account',
                    displayOrder: 300
                });
                
                this.addMenuItem('burgerMenu', 'Account', user.name, { 
                    label: 'Profile', 
                    url: `/${await this.user.slug}`, 
                    target: '_top',
                    testId: 'profile'
                });

                // Notification preferences
                this.addMenuItem('burgerMenu', 'Account', user.name, { 
                    label: 'Notification preferences', 
                    url: '/_actions/user/edit_user_notification_preferences', 
                    target: '_overlay',
                    testId: 'edit-user-notification-preferences'
                });



                this.addMenuItem('burgerMenu', 'Account', user.name, { 
                    label: 'Sign out', 
                    url: '/_actions/guest/sign_out', 
                    target: '_overlay',
                    displayOrder: 200,
                    testId: 'sign-out'
                });
            }

            // Sign In link for burger menu (shows when signed out)
            if (await this.isSignedOut) {
                this.addMenuItem('burgerMenu', 'Account', { 
                    label: 'Sign in', 
                    url: '/_actions/guest/sign_in', 
                    target: '_overlay',
                    displayOrder: 1000,
                    preload: true,
                    testId: 'sign-in'
                });
            }
        });
    }
};