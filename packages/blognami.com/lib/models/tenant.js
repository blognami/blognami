
export default {
    meta(){
        this.include('subscribable');

        this.addHook('beforeInsert', function(){
            if(this.subscriptionTier) return;
            this.subscriptionTier = 'demo';
            this.subscriptionExpiresAt = new Date(Date.now() + this.demoSeconds);
        });

        this.addHook('afterSubscribe', async function(){
            await this.update({
                subscriptionTier: 'paid',
                subscriptionExpiresAt: null
            });
        });

        this.addHook('afterUnsubscribe', async function(){
            await this.update({
                subscriptionTier: 'demo',
                subscriptionExpiresAt: new Date(Date.now() + this.demoSeconds)
            });
        });
    },

    demoSeconds: 3 * 24 * 60 * 60 * 1000, // 3 days

    get subscriptionConfig(){
        return {
            name: `Blog: ${this.name}`,
            currency: 'USD',
            monthlyPrice: 15,
            monthlyFeatures: ['Unlimited blog posts', 'Custom domain support', 'Premium support']
        };
    },

    get stripeProductId(){
        return this.workspace.config.stripe.productId;
    }
};
