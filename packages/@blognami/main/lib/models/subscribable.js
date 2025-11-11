export default {
    meta(){
        this.hasMany('subscriptions', { fromKey: 'id', toKey: 'subscribableId' });

        this.addHook(['afterInsert', 'afterUpdate'], async function(){
            const stripe = await this.database.stripe;
            await stripe.runHook('syncWithSubscribable', { args: [ this ] });
        });
    }
}