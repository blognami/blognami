
export default {
    meta(){
        this.hasMany('subscriptions', { fromKey: 'id', toKey: 'subscribableId' });

        this.addHook(['afterInsert', 'afterUpdate'], async subscribable => {
            const stripe = await subscribable.database.stripe;
            await stripe.trigger('syncWithSubscribable', subscribable);
        });
    }
}
