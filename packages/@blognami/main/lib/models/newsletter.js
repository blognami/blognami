export default {

    meta(){export default {

        this.include('singleton');    meta(){

        this.include('subscribable');        this.include('singleton');

                this.include('subscribable');

        this.mustNotBeBlank('monthlyPrice', {        

            when: ({ enableMonthly }) => enableMonthly        this.mustNotBeBlank('monthlyPrice', {

        });            when: ({ enableMonthly }) => enableMonthly

        this.mustNotBeBlank('yearlyPrice', {        });

            when: ({ enableYearly }) => enableYearly        this.mustNotBeBlank('yearlyPrice', {

        });            when: ({ enableYearly }) => enableYearly

        this.mustNotBeBlank('currency', {        });

            when: ({ enableMonthly, enableYearly }) => enableMonthly || enableYearly        this.mustNotBeBlank('currency', {

        });            when: ({ enableMonthly, enableYearly }) => enableMonthly || enableYearly

    },        });

    },

    get subscriptionConfig(){

        const out = {    get subscriptionConfig(){

            name: 'Newsletter',        const out = {

            currency: this.currency,            name: 'Newsletter',

        };            currency: this.currency,

        if(this.enableFree){        };

            out.freeFeatures = ['Access to all free content.'];        if(this.enableFree){

        }            out.freeFeatures = ['Access to all free content.'];

        if(this.enableMonthly){        }

            out.monthlyPrice = this.monthlyPrice;        if(this.enableMonthly){

            out.monthlyFeatures = ['Access to all premium content', 'Billed monthly.'];            out.monthlyPrice = this.monthlyPrice;

        }            out.monthlyFeatures = ['Access to all premium content', 'Billed monthly.'];

        if(this.enableYearly){        }

            out.yearlyPrice = this.yearlyPrice;        if(this.enableYearly){

            out.yearlyFeatures = ['Access to all premium content', 'Billed yearly.'];            out.yearlyPrice = this.yearlyPrice;

        }            out.yearlyFeatures = ['Access to all premium content', 'Billed yearly.'];

        return out;        }

    }        return out;

};    }
};
