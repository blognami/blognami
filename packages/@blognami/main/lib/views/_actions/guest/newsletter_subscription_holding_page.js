export default {
    async render(){
        const { action, returnUrl, subscribableId, userId } = this.params;

        if(action === 'poll'){
            while(true){
                const isSubscribed = await this.runInNewWorkspace(async _ => {
                    const subscribable = await _.database.subscribables
                        .where({ id: subscribableId }).first();
                    if(!subscribable) return false;
                    const user = await _.database.users.where({ id: userId }).first();
                    if(!user) return false;
                    return subscribable.isSubscribed(user, { tier: 'paid' });
                });
                if(isSubscribed) break;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            return this.renderRedirect({ url: returnUrl, target: '_parent' });
        }

        return this.renderView('_layout', {
            body: this.renderRedirect({
                url: `/_actions/guest/newsletter_subscription_holding_page?action=poll&subscribableId=${encodeURIComponent(subscribableId)}&userId=${encodeURIComponent(userId)}&returnUrl=${encodeURIComponent(returnUrl)}`,
                method: 'post',
                target: '_overlay',
                placeholder: '/_placeholders/overlay'
            })
        });
    }
};
