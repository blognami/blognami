
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
        this.mustNotBeBlank('currency');
    },

    get paidForSubscriptionTiers(){
        const out = [];
        if(this.enableMonthly) out.push({
            interval: 'month',
            price: this.monthlyPrice,
            currency: this.currency,
        });
        if(this.enableYearly) out.push({
            interval: 'year',
            price: this.yearlyPrice,
            currency: this.currency,
        });
        return out;
    }
};
