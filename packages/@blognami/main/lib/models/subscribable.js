export default {
    meta(){
        this.hasMany('subscriptions', { fromKey: 'id', toKey: 'subscribableId' });

        this.addHook(['afterInsert', 'afterUpdate'], async function(){
            const stripe = await this.database.stripe;
            if(stripe) await stripe.runHook('syncWithSubscribable', { args: [ this ] });
        });
    },

    async subscribe(user, options = {}){
        const { tier = 'free', plan = null, interval = null } = options;
        await this.database.lock(async () => {
            const subscription = await this.database.subscriptions.where({ userId: user.id, subscribableId: this.id }).first();

            if(subscription) {
                await subscription.update({ tier });
                return;
            }

            await this.database.subscriptions.insert({
                subscribableId: this.id,
                userId: user.id,
                tier
            });
        });

        await this.runHook('afterSubscribe', { args: [{ user, tier, plan, interval }] });
    },

    async createSubscribeUrl(user, options = {}){
        const stripe = await this.database.stripe;
        return stripe.createSubscribeUrl({ subscribableId: this.id, userId: user.id, email: user.email, ...options });
    },

    async updateSubscriptionPlan(user, { plan, interval }){
        const stripe = await this.database.stripe;
        await stripe.updateSubscriptionPlan({ subscribableId: this.id, userId: user.id, plan, interval });
        await this.runHook('afterSubscribe', { args: [{ user, tier: 'paid', plan, interval }] });
    },

    async isSubscribed(user, options = {}){
        if(!user) return false;
        const { tier = 'free' } = options;
        const subscription = await this.subscriptions.where({ userId: user.id }).first();
        if(tier == 'free' && subscription) return true;
        if(tier == 'paid' && subscription?.tier == 'paid') return true;

        return false;
    },

    async unsubscribe(user, options = {}){
        const { force = false } = options;
        const stripe = await this.database.stripe;
        const subscription = await this.subscriptions.where({ userId: user.id, subscribableId: this.id }).first();
        if(!subscription) return;
        const { tier } = subscription;
        if(tier == 'paid' && !force) {
            await stripe.cancelSubscription({ subscribableId: this.id, userId: user.id });
            await this.waitForSubscriptionToBeDeleted(user.id);
        } else {
            await subscription.delete();
        }
        await this.runHook('afterUnsubscribe', { args: [{ user, tier }] });
    },

    waitForSubscriptionToBeDeletedTimeout: 30000,

    async waitForSubscriptionToBeDeleted(userId){
        const timeout = Date.now() + this.waitForSubscriptionToBeDeletedTimeout;
        while(Date.now() < timeout) {
            const exists = await this.workspace.runInNewWorkspace(async _ => {
                const subscribable = await _.database.subscribables.where({ id: this.id }).first();
                return await subscribable.subscriptions.where({ userId }).first();
            });
            if(!exists) break;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}