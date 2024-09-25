
export default {
    async render(){
        const { plan } = this.params;

        const membershipTiers = await this.database.membershipTiers;

        const options = [];

        const currencySymbol = this.currency.index[membershipTiers.currency].symbol;

        if(membershipTiers.enableMonthly) options.push({
            title: 'Monthly',
            price: `${currencySymbol}${membershipTiers.monthlyPrice} per month`,
            description: 'Access to all premium content billed monthly.',
            action: '/_actions/subscribe?plan=monthly'
        });

        if(membershipTiers.enableYearly) options.push({
            title: 'Yearly',
            price: `${currencySymbol}${membershipTiers.yearlyPrice} per year`,
            description: 'Access to all premium content billed yearly.',
            action: '/_actions/subscribe?plan=yearly'
        });

        if(membershipTiers.enableFree) options.push({
            title: 'None',
            price: 'Free',
            description: 'Access to all free content.',
            action: '/_actions/subscribe?plan=free'
        });

        if(!plan) return this.renderHtml`
            <pinstripe-modal>
                ${this.renderView('_panel', {
                    title: 'Choose a subscription plan',
                    body: this.renderView('_actions/_subscription_options', { options }),
                    footer: this.renderView('_button', {
                        body: this.renderHtml`
                            Cancel
                            <script type="pinstripe">
                                this.parent.on('click', () => this.trigger('close'));
                            </script>
                        `
                    })
                })}
            </pinstripe-modal>
        `;
        
        let user;
        if(await this.session){
            user = await this.session.user;
        }

        if(!user) return this.renderHtml`
            <span data-component="pinstripe-anchor" data-href="/_actions/sign_in?title=${encodeURIComponent('Subscribe')}&redirectUrl=${encodeURIComponent(`/_actions/subscribe?plan=${plan}`)}">
                <script type="pinstripe">
                    this.parent.trigger('click');
                </script>
            </span>
        `;

        const reloadHtml = this.renderHtml`
            <script type="pinstripe">
                this.overlay.frame.load();
            </script>
        `;

        if(['monthly', 'yearly'].includes(user.membershipTier)) return reloadHtml;

        if(plan == 'free'){
            await user.update({ membershipTier: 'free' });

            return reloadHtml;
        }

        return this.renderHtml`
            <script type="pinstripe">
                window.location.href = ${this.renderHtml(JSON.stringify(await this.membership.createStripePaymentUrl({ interval: plan, userId: user.id })))};
            </script>
        `;
    },
};
