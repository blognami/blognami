
export default {
    async render(){
        const user = await this.session.user;

        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    <a href="/${user.slug}" target="_top" data-test-id="profile">Profile</a>
                    <a href="/_actions/guest/sign_out" target="_overlay" data-test-id="sign-out">Sign out</a>
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
}
