export default {
    meta(){
        this.addHook('initializeMenus', async function(){
            // Newsletter subscription menu (shows for any signed in user)
            if (await this.isSignedIn) {
                const user = await this.user;

                // Newsletter subscription (only show if user is subscribed)
                if (await user.isSubscribedToNewsletter()) {
                    const isPaid = await user.isSubscribedToNewsletter({ tier: 'paid' });
                    const confirmMessage = isPaid ? (
                        `Are you sure you want to unsubscribe? You will lose access to members only content, and any remaining subscription time will be lost.`
                    ) : (
                        `Are you sure you want to unsubscribe? You will lose access to members only content.`
                    );

                    this.addMenuItem('navbar', user.name, { 
                        label: `Unsubscribe (from ${isPaid ? 'paid' : 'free'} membership)`, 
                        url: `/_actions/user/unsubscribe?subscribableId=${this.database.newsletter.id}`, 
                        target: '_overlay',
                        testId: 'unsubscribe',
                        dataConfirm: confirmMessage
                    });

                    // Newsletter subscription for burger menu
                    this.addMenuItem('burgerMenu', 'Account', user.name, { 
                        label: `Unsubscribe (from ${isPaid ? 'paid' : 'free'} membership)`, 
                        url: `/_actions/user/unsubscribe?subscribableId=${this.database.newsletter.id}`, 
                        target: '_overlay',
                        testId: 'unsubscribe',
                        dataConfirm: confirmMessage
                    });
                }
            }

            // Admin-only Stripe Settings (shows for admin users when signed in)
            if (await this.isSignedIn && await this.user.role === 'admin') {
                // Edit Stripe link for navbar
                this.addMenuItem('navbar', 'Settings', { 
                    label: 'Stripe', 
                    url: '/_actions/admin/edit_stripe', 
                    target: '_overlay', 
                    testId: 'edit-stripe' 
                });

                // Edit Stripe link for burger menu
                this.addMenuItem('burgerMenu', 'Account', 'Settings', { 
                    label: 'Stripe', 
                    url: '/_actions/admin/edit_stripe', 
                    target: '_overlay', 
                    testId: 'edit-stripe' 
                });
            }
        });
    }
}