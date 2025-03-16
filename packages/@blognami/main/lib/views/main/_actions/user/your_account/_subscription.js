
export const styles = `
    .membership-tier {
        font-size: 0.8em;
    }
`;

export default {
    async render(){
        const user = await this.session.user;

        return this.renderHtml`
            ${() => {
                if(user.membershipTier != 'none') return this.renderHtml`
                    <a href="/_actions/user/unsubscribe" target="_overlay" data-test-id="unsubscribe" data-confirm="${user.membershipTier == 'paid' ? (
                        `Are you sure you want to unsubscribe? You will lose access to members only content, and any remaining subscription time will be lost.`
                    ):(
                        `Are you sure you want to unsubscribe? You will lose access to members only content.`
                    )}">Unsubscribe<br><div class="${this.cssClasses.membershipTier}">(from ${user.membershipTier} membership)</div></a>
                `
            }}
        `;
    }
};
