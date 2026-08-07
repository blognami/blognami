export default {
    meta(){
        this.addHook('initializeMenus', async function(){
            if(!await this.featureFlags.docs) return;

            this.addMenuItem('user', {
                label: 'Docs',
                url: '/docs',
                displayOrder: 4
            });

            this.addMenuItem('content', {
                label: 'Getting Started',
                displayOrder: 1
            });
        });
    }
};
