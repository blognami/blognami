
export default {
    meta(){
        this.assignProps({
            displayOrder: 300
        });
    },

    async render(){
        if(await this.isSignedOut) return;

        return this.renderViews('_navbar/_link', {
            href: '/_navbar/_links/_your_account/menu',
            target: '_overlay',
            'data-preload': 'true',
            'data-test-id': 'your-account',
            body: await this.user.name
        });
    }
}
