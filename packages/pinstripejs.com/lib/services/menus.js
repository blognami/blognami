export default {
    meta(){
        this.addHook('initializeMenus', function(){
            this.menus.navbar = [];
            this.addMenuItem('navbar', {
                label: 'Docs',
                url: '/',
                displayOrder: 1
            });
            this.addMenuItem('navbar', {
                label: 'Blog',
                url: 'https://blognami.com/pinstripe',
            });
            this.addMenuItem('navbar', {
                label: 'GitHub',
                partial: '_navbar/_github_link',
            });

            this.menus.sidebar = this.menus.sidebar.filter(item => item.label != 'About').map(item => {
                if(item.label == 'Getting Started'){
                    item.displayOrder = 1;
                }
                return item;
            });


            this.menus.burgerMenu = [];
            this.addMenuItem('burgerMenu', 'Info', {
                label: 'Docs',
                url: '/',
                displayOrder: 1
            });
            this.addMenuItem('burgerMenu', 'Info', {
                label: 'Blog',
                url: 'https://blognami.com/pinstripe',
            });
            this.addMenuItem('burgerMenu', 'Info', {
                label: 'GitHub',
                url: 'https://github.com/blognami/blognami'
            });

            this.menus.footer = [];
        });
    }
};