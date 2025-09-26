
export default {
    meta(){
        this.hasMany('subscriptions', { fromKey: 'id', toKey: 'subscribableId' });

        this.on(['after:insert', 'after:update'], async subscribable => {
            const stripe = await subscribable.database.stripe;
            await stripe.trigger('syncWithSubscribable', subscribable);
        });
    }
}
