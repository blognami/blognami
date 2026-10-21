export default {
    meta(){
        this.addHook('initializeMenus', async function(){
            if(!await this.featureFlags.docs) return;

            this.addMenuItem('sections', {
                label: 'Docs',
                url: '/docs',
                placeholder: '/_placeholders/document?section=docs',
                displayOrder: 4
            });

            this.addMenuItem('docs', {
                label: 'Getting Started',
                displayOrder: 1
            });
        });
    }
};
