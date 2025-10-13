
export default {
    meta(){
        this.assignProps({
            displayOrder: 0
        });
    },

    async render(){
        if(await this.isSignedOut) return;
        if(await this.user.role !== 'admin') return;

        return this.renderViews('_navbar/_link', {
            href: '/_navbar/_links/_add_content/menu',
            target: '_overlay',
            'data-preload': 'true',
            'data-test-id': 'add-content',
            body: 'Add'
        });
    }
}
