export default {
    create(){
        return this;
    },

    async stripeIsConfiguredCorrectly(){
        try {
            await this.stripe.products.list({
                limit: 1,
            });
            return true;
        } catch (error) {
            return false;
        }
    },

    async getStripeProduct(){
        const { id } = await this.database.membershipTiers;

        const { data: stripeProducts } = await this.stripe.products.search({
            query: `metadata['blognamiMembershipTiersId']:'${id}'`,
        });

        let out = stripeProducts[0];

        if(!out){
            out = await this.stripe.products.create({
                name: 'Membership',
                metadata: {
                    blognamiMembershipTiersId: id,
                    blognamiEnvironment: process.env.NODE_ENV,
                },
            });
        }

        return out;
    },

    async getStripePrices(){
        const { id: stripeProductId } = await this.getStripeProduct();

        const { data: stripePrices } = await this.stripe.prices.search({
            query: `product:'${stripeProductId}'`,
        });

        const { enableMonthly, monthlyPrice, enableYearly, yearlyPrice, currency } = await this.database.membershipTiers;
        
        const out = {};

        const stripeMonthlyPrice = stripePrices.find(price => price.recurring.interval == 'month');
        if(enableMonthly){
            if(stripeMonthlyPrice){
                const updates = {};
                if(!stripeMonthlyPrice.active) updates.active = true;
                if(stripeMonthlyPrice.unit_amount != monthlyPrice) updates.unit_amount = monthlyPrice;
                if(Object.keys(updates).length) {
                    out.monthly = await this.stripe.prices.update(stripeMonthlyPrice.id, updates);
                } else {
                    out.monthly = stripeMonthlyPrice;
                }
            } else {
                out.monthly = await this.stripe.prices.create({
                    product: stripeProductId,
                    currency,
                    unit_amount: monthlyPrice,
                    recurring: {
                        interval: 'month',
                    },
                });
            }
        } else if(stripeMonthlyPrice.active){
            await this.stripe.prices.update(stripeMonthlyPrice.id, { active: false });
        }

        const stripeYearlyPrice = stripePrices.find(price => price.recurring.interval == 'year');
        if(enableYearly){
            if(stripeYearlyPrice){
                const updates = {};
                if(!stripeYearlyPrice.active) updates.active = true;
                if(stripeYearlyPrice.unit_amount != yearlyPrice) updates.unit_amount = yearlyPrice;
                if(Object.keys(updates).length) {
                    out.yearly = await this.stripe.prices.update(stripeYearlyPrice.id, updates);
                } else {
                    out.yearly = stripeYearlyPrice;
                }
            } else {
                out.yearly = await this.stripe.prices.create({
                    product: stripeProductId,
                    currency,
                    unit_amount: yearlyPrice,
                    recurring: {
                        interval: 'year',
                    },
                });
            }
        } else if(stripeYearlyPrice.active){
            await this.stripe.prices.update(stripeYearlyPrice.id, { active: false });
        }

        return out;
    },
    
    createStripePaymentLink({ interval, userId }){
        
    },

    async syncWithStripe(){
        console.log(JSON.stringify(await this.getStripePrices(), null, 2));
    },

    async userHasAccessTo(access){
        if(access == 'public') return true;

        let user;
        if(await this.session){
            user = await this.session.user;
        }

        if(access == 'free' &&  ['free', 'monthly', 'yearly'].includes(user?.membershipTier)) return true;
        if(access == 'paid' &&  ['monthly', 'yearly'].includes(user?.membershipTier)) return true;

        return false;
    }
};