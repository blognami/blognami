export default {
    meta(){
        this.addHook('initializeMenus', async function(){
            if(!await this.featureFlags.docs) return;

            this.addMenuItem('sections', {
                label: 'Docs',
                url: '/docs',
                displayOrder: 4
            });

            this.addMenuItem('docs', {
                label: 'Getting Started',
                displayOrder: 1
            });
        });
    }
};
