
export default {
    meta(){
        this.include('singleton');
        this.mustNotBeBlank('monthlyPrice', {
            when: ({ enableMonthly }) => enableMonthly
        });
        this.mustNotBeBlank('yearlyPrice', {
            when: ({ enableYearly }) => enableYearly
        });
        this.mustNotBeBlank('currency');
    }
};
