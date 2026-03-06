export default {
    meta(){
        this.addHook('initializeMenus', async function(){
            if (!await this.isSignedIn || (await this.user).role !== 'admin') return;

            this.addMenuItem('user', 'Add', {
                label: 'Page',
                url: '/_actions/admin/add_page',
                target: '_overlay',
                testId: 'add-page'
            });

            this.addMenuItem('user', 'Find', {
                label: 'Page',
                url: '/_actions/admin/find_page',
                target: '_overlay',
                testId: 'find-page'
            });
        });
    }
};
