export default {
    async render(){
        const user = await this.session.user;
        const subscribable = await this.database.subscribables.where({ id: this.params.subscribableId }).first();
        if(!user || !subscribable) return;

        await user.unsubscribeFrom(subscribable);

        return this.renderRedirect({ target: '_top' });
    }
}