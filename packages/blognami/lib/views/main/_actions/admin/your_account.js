
export default {
    async render(){
        const user = await this.session.user;

        return this.renderHtml`
            <pinstripe-popover>
                ${this.renderView('_menu', {
                    items: [
                        { href: `/${user.slug}`, target: '_top', body: 'Profile', testId: 'profile'},
                        { href: `/_actions/sign_out`, target: '_overlay', body: 'Sign out', testId: 'sign-out'}
                    ]
                })}
            </pinstripe-popover>
        `;
    }
}
