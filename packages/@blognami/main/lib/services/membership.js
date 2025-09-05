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
            query: `metadata['pinstripeMembershipTiersId']:'${id}' AND active:'true'`,
        });

        let out = stripeProducts[0];

        if(!out){
            out = await this.stripe.products.create({
                name: 'Membership',
                metadata: {
                    pinstripeMembershipTiersId: id,
                    pinstripeEnvironment: process.env.NODE_ENV,
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

    async getStripeCustomer({ userId, email }){
        const { data: [ stripeCustomer ] } = await this.stripe.customers.search({
            query: `metadata['pinstripeUserId']:'${userId}'`,
        });
        if(stripeCustomer) return stripeCustomer;

        if(email) return await this.stripe.customers.create({
            email,
            metadata: {
                pinstripeUserId: userId,
            },
        });
    },

    async createCheckoutSession({ interval, userId, email, returnUrl = new URL('/', this.initialParams._url).toString() }){
        const stripePrices = await this.getStripePrices();
        const stripePrice = stripePrices[interval];
        
        if(!stripePrice) return;

        console.log({ stripePrice });

        const stripeCustomer = await this.getStripeCustomer({ userId, email });

        console.log({ stripeCustomer });

        return await this.stripe.checkout.sessions.create({
            success_url: returnUrl,
            customer: stripeCustomer.id,
            line_items: [
                {
                  price: stripePrice.id,
                  quantity: 1,
                },
            ],
            mode: 'subscription',
        });
    },

    async createStripePaymentUrl({ interval, userId, email, returnUrl }){
        const stripeCheckoutSession = await this.createCheckoutSession({ interval, userId, email, returnUrl });

        return stripeCheckoutSession?.url;
    },

    async cancelSubscription({ userId }){
        const stripeCustomer = await this.getStripeCustomer({ userId });

        if(!stripeCustomer) return;

        const subscriptions = await this.stripe.subscriptions.list({
            customer: stripeCustomer.id,
            status: 'active'
        });

        for(const { id } of subscriptions.data){
            await this.stripe.subscriptions.cancel(id);
        }
    },

    getWebhookUrl(){
        const host = this.initialParams._headers.host;
        const baseUrl = new URL('/', this.initialParams._url);
        baseUrl.protocol = 'https:';
        baseUrl.host = host;
        return new URL('/_actions/guest/stripe_webhook', baseUrl);
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
                    'customer.subscription.created',
                    'customer.subscription.deleted'
                ],
                metadata: {
                    pinstripeMembershipTiersId: id,
                    pinstripeEnvironment: process.env.NODE_ENV,
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

        if(access == 'free' &&  ['free', 'paid'].includes(user?.membershipTier)) return true;
        if(access == 'paid' &&  user?.membershipTier == 'paid') return true;

        return false;
    }
};