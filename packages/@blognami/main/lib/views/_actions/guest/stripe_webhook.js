
export default {
    async render(){
        const { webhookSecret } = await this.database.stripe;

        const stripeSignature = this.params._headers['stripe-signature'];

        console.log('-----------------stripeSignature', stripeSignature);

        console.log('-----------------stripeWebhookBody', this.params._body);

        let event;

        try {
            event = await this.database.stripe.api.webhooks.constructEvent(this.params._body, stripeSignature, webhookSecret);
        } catch (error) {
            console.error('-----------------stripeWebhookError', error);
            return [403, { 'content-type': 'application/json' }, [JSON.stringify({ error: 'Invalid signature' })]];
        }

        try {
            const matches = event.type.match(/^customer\.subscription\.(created|deleted)$/);
            if(matches){
                const type = matches[1];
                const { customer: customerId } = event.data.object;
                const { metadata: { blognamiUserId } } = await this.database.stripe.api.customers.retrieve(customerId);
                const user = await this.database.users.where({ id: blognamiUserId }).first();
                if(user){
                    if(type == 'created'){
                        await user.createNewsletterSubscription({ tier: 'paid' });
                    } else {
                        console.log('-----------------cancelling subscription for user', user.id);
                        await database.subscriptions.where({
                            userId: user.id,
                            subscribableId: await this.database.newsletter.id
                        }).delete();
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
