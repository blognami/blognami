export default {
    meta(){
        this.addHook('initializeMenus', function(){
            this.menus.user = [];
            this.addMenuItem('user', {
                label: 'Docs',
                url: '/',
                displayOrder: 1
            });
            this.addMenuItem('user', {
                label: 'Blog',
                url: 'https://blognami.com/pinstripe',
            });
            this.addMenuItem('user', {
                label: 'GitHub',
                url: 'https://github.com/blognami/blognami'
            });

            this.addMenuItem('content', {
                label: 'Getting Started',
                displayOrder: 1
            });

            this.menus.legal = [];
        });
    }
};
