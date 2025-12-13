export default {
    async render(){
        const { webhookSecret } = await this.database.stripe;

        const stripeSignature = this.params._headers['stripe-signature'];

        let event;

        try {
            event = await this.database.stripe.api.webhooks.constructEvent(this.params._body, stripeSignature, webhookSecret);
        } catch (error) {
            console.error(error);
            return [403, { 'content-type': 'application/json' }, [JSON.stringify({ error: 'Invalid signature' })]];
        }

        try {
            const matches = event.type.match(/^customer\.subscription\.(created|deleted)$/);
            if(matches){
                const type = matches[1];
                const { metadata: { blognamiUserId: userId, blognamiSubscribableId: subscribableId } } = event.data.object;
                const user = await this.database.users.where({ id: userId }).first();
                const subscribable = await this.database.subscribables.where({ id: subscribableId }).first();
                if(user && subscribable){
                    if(type == 'created'){
                        await subscribable.subscribe(user, { tier: 'paid' });
                    } else {
                        await subscribable.unsubscribe(user);
                    }
                }
            }
        } catch (error) {
            console.error(error);
            return [500, { 'content-type': 'application/json' }, [JSON.stringify({ error: 'Internal server error' })]];
        }

        return [200, { 'content-type': 'application/json' }, [JSON.stringify({ success: true })]];
    }
}