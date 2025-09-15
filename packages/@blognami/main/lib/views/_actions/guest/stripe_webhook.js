
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
                console.log(`----------- subscription ${JSON.stringify({ type, userId, subscribableId })}`);
                // console.log(`event.data.object ${JSON.stringify(event.data.object, null, 2)}`);
                const user = await this.database.users.where({ id: userId }).first();
                if(user){
                    if(type == 'created'){
                        const subscribable = await this.database.subscribables.where({ id: subscribableId }).first();
                        if(subscribable) await user.subscribeTo(subscribable, { tier: 'paid' });
                    } else {
                        await this.database.subscriptions.where({ userId, subscribableId }).delete();
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
