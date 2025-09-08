
export default {
    meta(){
        this.hasMany('subscriptions');
        this.hasMany('users', { through: ['subscriptions', 'user'] });
    }
}
