
export const styles = `
    .membership-tier {
        font-size: 0.8em;
    }
`;

export default {
    async render(){
        const user = await this.session.user;

        const items = [
            { href: `/${user.slug}`, target: '_top', body: 'Profile', testId: 'profile'},
        ];

        if(user.membershipTier != 'none') items.push(
            {
                href: `/_actions/user/unsubscribe`,
                target: '_overlay',
                body: this.renderHtml`Unsubscribe<br><div class="${this.cssClasses.membershipTier}">(from ${user.membershipTier} membership)</div>`,
                testId: 'unsubscribe',
                confirm: user.membershipTier == 'paid' ? (
                    `Are you sure you want to unsubscribe? You will lose access to members only content, and any remaining subscription time will be lost.`
                ):(
                    `Are you sure you want to unsubscribe? You will lose access to members only content.`
                )
            }
        );

        items.push({ href: `/_actions/guest/sign_out`, target: '_overlay', body: 'Sign out', testId: 'sign-out'});

        return this.renderHtml`
            <pinstripe-popover>
                ${this.renderView('_menu', { items })}
            </pinstripe-popover>
        `;
    }
}
