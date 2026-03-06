export default {
    meta(){
        this.addHook('initializeMenus', async function(){
            if (!await this.isSignedIn || (await this.user).role !== 'admin') return;

            this.addMenuItem('user', 'Add', {
                label: 'Tag',
                url: '/_actions/admin/add_tag',
                target: '_overlay',
                testId: 'add-tag'
            });

            this.addMenuItem('user', 'Find', {
                label: 'Tag',
                url: '/_actions/admin/find_tag',
                target: '_overlay',
                testId: 'find-tag'
            });
        });
    }
};
