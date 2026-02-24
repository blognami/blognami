export default {
    meta(){
        this.addHook('initializeMenus', async function(){
            if(!await this.featureFlags.portal) return;

            // Signed out links
            if(await this.isSignedOut){
                this.addMenuItem('user', {
                    label: 'Get started',
                    url: '/_actions/guest/sign_in',
                    target: '_overlay',
                    displayOrder: 0
                });

                this.addMenuItem('user', {
                    label: 'Demo',
                    url: '/_actions/guest/add_blog',
                    target: '_overlay',
                    displayOrder: 10
                });
            }

            // GitHub link (always visible when portal enabled)
            this.addMenuItem('user', {
                label: 'GitHub',
                url: 'https://github.com/blognami/blognami',
                target: '_blank',
                displayOrder: 5
            });

            // Signed in links with dropdowns
            if(await this.isSignedIn){
                this.addMenuItem('user', 'Add', {
                    label: 'Blog',
                    url: '/_actions/guest/add_blog',
                    target: '_overlay'
                });

                this.addMenuItem('user', 'Find', {
                    label: 'Blog',
                    url: '/_actions/user/find_blog',
                    target: '_overlay'
                });
            }
        });

        this.addHook('initializeMenus', async function(){
            const tenant = await this.database.tenant;
            if(tenant && (tenant.subscriptionPlan === 'starter' || tenant.subscriptionPlan === 'publisher')){
                this.addMenuItem('user', 'Settings', {
                    label: 'Manage subscription',
                    url: '/_actions/admin/saas_manage_subscription',
                    target: '_overlay',
                    showIf: 'admin'
                });

                this.addMenuItem('user', 'Settings', {
                    label: 'Custom domain',
                    url: '/_actions/admin/connect_custom_domain',
                    target: '_overlay',
                    showIf: 'admin'
                });
            }
        });
    }
};
