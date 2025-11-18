export default {
    meta(){
        this.hasMany('subscriptions', { fromKey: 'id', toKey: 'subscribableId' });

        this.addHook(['afterInsert', 'afterUpdate'], async function(){
            const stripe = await this.database.stripe;
            await stripe.runHook('syncWithSubscribable', { args: [ this ] });
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
    },

    async createSubscribeUrl(user, options = {}){
        return this.database.stripe.createSubscribeUrl({ subscribableId: this.id, userId: user.id, email: user.email, ...options });
    },

    async isSubscribed(user, options = {}){
        const { tier = 'free' } = options;
        const subscription = await this.subscriptions.where({ userId: user.id }).first();
        if(tier == 'free' && subscription) return true;
        if(tier == 'paid' && subscription?.tier == 'paid') return true;

        return false;
    },

    async unsubscribe(user){
        const subscription = await this.subscriptions.where({ userId: user.id, subscribableId: this.id }).first();
        if(!subscription) return;
        if(subscription.tier == 'paid'){
            await this.database.stripe.cancelSubscription({ subscribableId: this.id, userId: user.id });
        } else {
            await subscription.delete();
        }
    }
}