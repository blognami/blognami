
export default {
    async render(){
        const user = await this.session.user;

        if(user.membershipTier == 'paid'){
            await this.membership.cancelSubscription({ userId: user.id });
        } else {
            await user.update({ membershipTier: 'none' });
        }

        return this.renderHtml`
            <span data-component="pinstripe-anchor" data-target="_top">
                <script type="pinstripe">
                    this.parent.trigger('click');
                </script>
            </span>
        `;
    }
}