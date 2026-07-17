export default {
    meta(){
        this.include('singleton');
        this.include('subscribable');
        
        this.mustNotBeBlank('monthlyPrice', {
            when: ({ enableMonthly }) => enableMonthly
        });
        this.mustNotBeBlank('yearlyPrice', {
            when: ({ enableYearly }) => enableYearly
        });
        this.mustNotBeBlank('currency', {
            when: ({ enableMonthly, enableYearly }) => enableMonthly || enableYearly
        });
    },

    async ctaState(user){
        if(user?.role == 'admin') return 'none';
        if(!this.enableFree && !this.enableMonthly && !this.enableYearly) return 'none';
        if(await this.isSubscribed(user, { tier: 'paid' })) return 'none';
        if(await this.isSubscribed(user)){
            if(this.enableMonthly || this.enableYearly) return 'upgrade';
            return 'none';
        }
        return 'subscribe';
    },

    get subscriptionConfig(){
        const out = {
            name: 'Newsletter',
            currency: this.currency,
        };
        if(this.enableFree){
            out.freeFeatures = ['Access to all free content.'];
        }
        if(this.enableMonthly){
            out.monthlyPrice = this.monthlyPrice;
            out.monthlyFeatures = ['Access to all premium content', 'Billed monthly.'];
        }
        if(this.enableYearly){
            out.yearlyPrice = this.yearlyPrice;
            out.yearlyFeatures = ['Access to all premium content', 'Billed yearly.'];
        }
        return out;
    }
};