
export default {
    async render(){
        if(await this.isSignedIn) return;

        return this.renderViews('_navbar/_link', {
            href: '/_actions/guest/sign_in',
            target: '_overlay',
            'data-preload': 'true',
            'data-test-id': 'sign-in',
            body: 'Sign in'
        });
    }
}
