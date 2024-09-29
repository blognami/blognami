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
            query: `metadata['blognamiMembershipTiersId']:'${id}' AND active:'true'`,
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
        
        const stripePrices = [];
        let starting_after;
        while(true){
            const { data: currentStripePrices, has_more } = await this.stripe.prices.list({
                product: stripeProductId,
                limit: 100,
                starting_after,
            });
            stripePrices.push(...currentStripePrices);
            if(!has_more) break;
            starting_after = currentStripePrices[currentStripePrices.length - 1].id;
        }

        const { enableMonthly, monthlyPrice, enableYearly, yearlyPrice, currency } = await this.database.membershipTiers;

        const out = {};
        
        const normalizedCurrency = currency.toLowerCase();
        const stripeMonthlyPrices = stripePrices.filter(({ recurring }) => recurring.interval == 'month');
        const normalizedMonthlyPrice = monthlyPrice * 100;

        if(enableMonthly){
            const stripeMonthlyPrice = stripeMonthlyPrices.find(({ unit_amount, currency }) => unit_amount == normalizedMonthlyPrice && currency == normalizedCurrency);
            if(stripeMonthlyPrice) {
                if(stripeMonthlyPrice.active) {
                    out.monthly = stripeMonthlyPrice;
                } else {
                    out.monthly = await this.stripe.prices.update(stripeMonthlyPrice.id, { active: true });
                }
            } else {
                out.monthly = await this.stripe.prices.create({
                    product: stripeProductId,
                    currency: normalizedCurrency,
                    unit_amount: normalizedMonthlyPrice,
                    recurring: {
                        interval: 'month',
                    },
                });
            }
        }

        for(const { active, unit_amount, currency, id } of stripeMonthlyPrices){
            if(!active) continue;
            if(enableMonthly && unit_amount == normalizedMonthlyPrice && currency == normalizedCurrency) continue;
            await this.stripe.prices.update(id, { active: false });
        }

        const stripeYearlyPrices = stripePrices.filter(({ recurring }) => recurring.interval == 'year');
        const normalizedYearlyPrice = yearlyPrice * 100;

        if(enableYearly){
            const stripeYearlyPrice = stripeYearlyPrices.find(({ unit_amount, currency }) => unit_amount == normalizedYearlyPrice && currency == normalizedCurrency);
            if(stripeYearlyPrice) {
                if(stripeYearlyPrice.active) {
                    out.yearly = stripeYearlyPrice;
                } else {
                    out.yearly = await this.stripe.prices.update(stripeYearlyPrice.id, { active: true });
                }
            } else {
                out.yearly = await this.stripe.prices.create({
                    product: stripeProductId,
                    currency: normalizedCurrency,
                    unit_amount: normalizedYearlyPrice,
                    recurring: {
                        interval: 'year',
                    },
                });
            }
        }

        for(const { active, unit_amount, currency, id } of stripeYearlyPrices){
            if(!active) continue;
            if(enableYearly && unit_amount == normalizedYearlyPrice && currency == normalizedCurrency) continue;
            await this.stripe.prices.update(id, { active: false });
        }

        return out;
    },
    
    async createStripePaymentLink({ interval, userId, redirectUrl = new URL('/', this.initialParams._url).toString() }){
        const stripePrices = await this.getStripePrices();
        const stripePrice = stripePrices[interval];

        console.log('----------------------- redirectUrl', redirectUrl);
        
        if(!stripePrice) return;

        return await this.stripe.paymentLinks.create({
            line_items: [
              {
                price: stripePrice.id,
                quantity: 1,
              },
            ],
            metadata: {
                blognamiUserId: userId,
            },
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: redirectUrl
                }
            }
        });
    },

    async createStripePaymentUrl({ interval, userId }){
        const stripePaymentLink = await this.createStripePaymentLink({ interval, userId });

        return stripePaymentLink?.url;
    },

    getWebhookUrl(){
        const host = this.initialParams._headers.host;
        const baseUrl = new URL('/', this.initialParams._url);
        baseUrl.protocol = 'https:';
        baseUrl.host = host;
        return new URL('/_actions/stripe_webhook', baseUrl);
    },

    webhookUrlIsPublicallyAccessible(){
        const { hostname } = this.getWebhookUrl();
        return !['localhost', '127.0.0.1'].includes(hostname);
    },

    async getStripeWebhookEndpoint(){
        const { id } = await this.database.membershipTiers;
        const webhookUrl = this.getWebhookUrl();
        const { data: stripeWebhookEndpoints } = await this.stripe.webhookEndpoints.list();
        

        let out = stripeWebhookEndpoints.find(({ url }) => url == webhookUrl.toString());

        if(!out){
            out = await this.stripe.webhookEndpoints.create({
                url: webhookUrl.toString(),
                enabled_events: [
                    'customer.created',
                    'customer.subscription.deleted',
                    'customer.subscription.created',
                ],
                metadata: {
                    blognamiMembershipTiersId: id,
                    blognamiEnvironment: process.env.NODE_ENV,
                },
            });
        }

        return out;   
    },

    async syncWithStripe(){
        await this.getStripePrices();
        if(this.webhookUrlIsPublicallyAccessible()) await this.getStripeWebhookEndpoint();
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