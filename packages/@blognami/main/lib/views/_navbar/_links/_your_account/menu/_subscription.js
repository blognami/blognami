
export const styles = `
    .membership-tier {
        font-size: 0.8em;
    }
`;

export default {
    async render(){
        const user = await this.user;

        if(!await user.isSubscribedToNewsletter()) return;

        const isPaid = await user.isSubscribedToNewsletter({ tier: 'paid' });

        const confirmMessage = isPaid ? (
            `Are you sure you want to unsubscribe? You will lose access to members only content, and any remaining subscription time will be lost.`
        ):(
            `Are you sure you want to unsubscribe? You will lose access to members only content.`
        );

        return this.renderHtml`
            <a
                href="/_actions/user/unsubscribe?subscribableId=${this.database.newsletter.id}"
                target="_overlay"
                data-test-id="unsubscribe"
                data-confirm="${confirmMessage}"
            >
                Unsubscribe<br>
                <div class="${this.cssClasses.membershipTier}">(from ${isPaid ? 'paid' : 'free'} membership)</div>
            </a>
        `;
    }
};
