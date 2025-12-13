export default {
    meta(){
        this.hasMany('subscriptions', { fromKey: 'id', toKey: 'subscribableId' });

        this.addHook(['afterInsert', 'afterUpdate'], async function(){
            const stripe = await this.database.stripe;
            if(stripe) await stripe.runHook('syncWithSubscribable', { args: [ this ] });
        });
    },

    async subscribe(user, options = {}){
        const { tier = 'free' } = options;

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

        await this.runHook('afterSubscribe', { user, tier });
    },

    async createSubscribeUrl(user, options = {}){
        const stripe = await this.database.stripe;
        return stripe.createSubscribeUrl({ subscribableId: this.id, userId: user.id, email: user.email, ...options });
    },

    async isSubscribed(user, options = {}){
        const { tier = 'free' } = options;
        const subscription = await this.subscriptions.where({ userId: user.id }).first();
        if(tier == 'free' && subscription) return true;
        if(tier == 'paid' && subscription?.tier == 'paid') return true;

        return false;
    },

    async unsubscribe(user, options = {}){
        const stripe = await this.database.stripe;
        const subscription = await this.subscriptions.where({ userId: user.id, subscribableId: this.id }).first();
        if(!subscription) return;
        const { tier } = subscription;
        if(tier == 'paid'){
            await stripe.cancelSubscription({ subscribableId: this.id, userId: user.id });
        } else {
            await subscription.delete();
        }
        await this.runHook('afterUnsubscribe', { user, tier });
    }
}