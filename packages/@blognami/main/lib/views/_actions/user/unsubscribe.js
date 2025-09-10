
export default {
    async render(){
        const user = await this.session.user;

        await user.cancelNewsletterSubscription();

        return this.renderRedirect({ target: '_top' });
    }
}