
export default {
    meta(){
        this.hasMany('subscriptions');
        this.hasMany('users', { through: ['subscriptions', 'user'] });

        this.on(['after:insert', 'after:update'], async subscribable => {
            const stripe = await subscribable.database.stripe;
            await stripe.trigger('syncWithSubscribable', subscribable);
        });
    }
}
