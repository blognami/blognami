
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

    get subscriptionConfig(){
        const out = { currency: this.currency };
        if(this.enableMonthly) out.monthlyPrice = this.monthlyPrice;
        if(this.enableYearly) out.yearlyPrice = this.yearlyPrice;
        return out;
    }
};
