export default {
    meta(){
        this.addHook('initializeMenus', function(){
            // Admin-only tag links
            this.addMenuItem('user', 'Add', {
                label: 'Tag',
                url: '/_actions/admin/add_tag',
                target: '_overlay',
                testId: 'add-tag',
                showIf: 'admin'
            });

            this.addMenuItem('user', 'Find', {
                label: 'Tag',
                url: '/_actions/admin/find_tag',
                target: '_overlay',
                testId: 'find-tag',
                showIf: 'admin'
            });
        });
    }
};
