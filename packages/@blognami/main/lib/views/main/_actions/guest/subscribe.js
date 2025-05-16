
export default {
    async render(){
        let { plan, returnUrl } = this.params;

        const membershipTiers = await this.database.membershipTiers;

        const options = [];

        const currencySymbol = this.currency.index[membershipTiers.currency].symbol;

        if(membershipTiers.enableMonthly) options.push({
            name: 'monthly',
            title: 'Monthly',
            price: `${currencySymbol}${membershipTiers.monthlyPrice} per month`,
            features: ['Access to all premium content', 'Billed monthly.'],
            action: `/_actions/guest/subscribe?plan=monthly&returnUrl=${encodeURIComponent(returnUrl)}`
        });

        if(membershipTiers.enableYearly) options.push({
            name: 'yearly',
            title: 'Yearly',
            price: `${currencySymbol}${membershipTiers.yearlyPrice} per year`,
            features: ['Access to all premium content', 'Billed yearly.'],
            action: `/_actions/guest/subscribe?plan=yearly&returnUrl=${encodeURIComponent(returnUrl)}`
        });

        if(membershipTiers.enableFree) options.push({
            name: 'free',
            title: 'None',
            price: 'Free',
            features: ['Access to all free content.'],
            action: `/_actions/guest/subscribe?plan=free&returnUrl=${encodeURIComponent(returnUrl)}`
        });

        if(options.length == 1) plan = options[0].name;

        if(!plan) return this.renderHtml`
            <pinstripe-modal>
                ${this.renderView('_panel', {
                    title: 'Choose a subscription plan',
                    body: this.renderView('_actions/guest/_subscription_options', { options }),
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

        if(!user) return this.renderRedirect({
            url: `/_actions/guest/sign_in?title=${encodeURIComponent('Subscribe')}&returnUrl=${encodeURIComponent(`/_actions/guest/subscribe?plan=${plan}&returnUrl=${encodeURIComponent(returnUrl)}`)}`
        });

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
                window.location.href = ${this.renderHtml(JSON.stringify(await this.membership.createStripePaymentUrl({ interval: plan, userId: user.id, email: user.email, returnUrl })))};
            </script>
        `;
    },
};
