export default {
    async render(){
        let { subscribableId, plan, returnUrl } = this.params;

        const subscribable = await this.database.subscribables.where({ id: subscribableId }).first();

        if(!subscribable) return;

        const { 
            currency, 
            monthlyPrice, 
            monthlyFeatures, 
            yearlyPrice, 
            yearlyFeatures, 
            freeFeatures 
        } = subscribable.subscriptionConfig;

        const options = [];

        const currencySymbol = this.currency.index[currency].symbol;

        if(monthlyPrice !== undefined) options.push({
            name: 'monthly',
            title: 'Monthly',
            price: `${currencySymbol}${monthlyPrice} per month`,
            features: monthlyFeatures,
            action: `/_actions/guest/subscribe?plan=monthly&returnUrl=${encodeURIComponent(returnUrl)}`
        });

        if(yearlyPrice !== undefined) options.push({
            name: 'yearly',
            title: 'Yearly',
            price: `${currencySymbol}${yearlyPrice} per year`,
            features: yearlyFeatures,
            action: `/_actions/guest/subscribe?plan=yearly&returnUrl=${encodeURIComponent(returnUrl)}`
        });

        if(freeFeatures) options.push({
            name: 'free',
            title: 'None',
            price: 'Free',
            features: freeFeatures,
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
            url: `/_actions/guest/sign_in?title=${encodeURIComponent('Subscribe')}&returnUrl=${encodeURIComponent(`/_actions/guest/subscribe?subscribableId=${subscribableId}&plan=${plan}&returnUrl=${encodeURIComponent(returnUrl)}`)}`
        });

        const reloadHtml = this.renderHtml`
            <script type="pinstripe">
                this.overlay.frame.load();
            </script>
        `;

        if(await subscribable.isSubscribed(user, { tier: 'paid' })) return reloadHtml;

        if(plan == 'free'){
            await subscribable.subscribe(user);

            return reloadHtml;
        }

        return this.renderHtml`
            <script type="pinstripe">
                window.location.href = ${this.renderHtml(JSON.stringify(await subscribable.createSubscribeUrl(user, { interval: plan, returnUrl })))};
            </script>
        `;
    },
};