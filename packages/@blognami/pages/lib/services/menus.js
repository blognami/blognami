export default {
    meta(){
        this.addHook('initializeMenus', function(){
            // Admin-only page links
            this.addMenuItem('user', 'Add', {
                label: 'Page',
                url: '/_actions/admin/add_page',
                target: '_overlay',
                testId: 'add-page',
                showIf: 'admin'
            });

            this.addMenuItem('user', 'Find', {
                label: 'Page',
                url: '/_actions/admin/find_page',
                target: '_overlay',
                testId: 'find-page',
                showIf: 'admin'
            });
        });
    }
};
