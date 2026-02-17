
export default {
    meta(){
        this.include('subscribable');

        this.addHook('beforeInsert', function(){
            if(this.subscriptionTier) return;
            this.subscriptionTier = 'demo';
            this.subscriptionExpiresAt = new Date(Date.now() + this.demoSeconds);
        });

        this.addHook('afterSubscribe', async function({ plan, interval }){
            const updates = {
                subscriptionTier: 'paid',
                subscriptionExpiresAt: null
            };

            if(plan){
                updates.subscriptionPlan = plan;
            }
            if(interval){
                updates.subscriptionInterval = interval;
            }

            await this.update(updates);
        });

        this.addHook('afterUnsubscribe', async function(){
            await this.update({
                subscriptionTier: 'demo',
                subscriptionExpiresAt: new Date(Date.now() + this.demoSeconds),
                subscriptionPlan: 'none',
                subscriptionInterval: null
            });
        });
    },

    demoSeconds: 3 * 24 * 60 * 60 * 1000, // 3 days

    get subscriptionConfig(){
        return {
            plans: {
                starter: {
                    name: 'Starter',
                    currency: 'USD',
                    monthlyPrice: 15,
                    yearlyPrice: 144,
                    features: [
                        '5,000 emails/month',
                        'Custom domain',
                        'Email support'
                    ]
                },
                publisher: {
                    name: 'Publisher',
                    currency: 'USD',
                    monthlyPrice: 29,
                    yearlyPrice: 288,
                    features: [
                        '25,000 emails/month',
                        'Custom domain',
                        'Priority support',
                        'Advanced analytics'
                    ]
                }
            }
        };
    },

    get isCustomDomainEnabled(){
        return this.subscriptionPlan === 'publisher';
    },

    get monthlyEmailAllowance(){
        const baseAllowances = {
            starter: 5000,
            publisher: 25000
        };

        return baseAllowances[this.subscriptionPlan] || 0;
    },

    get isActive(){
        return this.subscriptionPlan === 'starter' || this.subscriptionPlan === 'publisher';
    }
};
