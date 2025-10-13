
export default {
    async render(){
        if(await this.isSignedOut) return;
        if(await this.user.role !== 'admin') return;

        return this.renderViews('_navbar/_link', {
            href: '/_navbar/_links/_edit_settings/menu',
            target: '_overlay',
            'data-preload': 'true',
            'data-test-id': 'edit-settings',
            body: 'Settings'
        });
    }
}
