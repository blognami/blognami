export default {
    async render(){
        const user = await this.session.user;
        const subscribable = await this.database.subscribables.where({ id: this.params.subscribableId }).first();
        if(!user || !subscribable) return;

        await subscribable.unsubscribe(user);

        return this.renderRedirect({ target: '_top' });
    }
}