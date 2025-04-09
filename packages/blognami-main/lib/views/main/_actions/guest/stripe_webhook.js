
export default {
    async render(){
        const { webhookSecret } = await this.database.stripe;

        const stripeSignature = this.params._headers['stripe-signature'];

        let event;

        try {
            event = await this.stripe.webhooks.constructEvent(this.params._body, stripeSignature, webhookSecret);
        } catch (error) {
            console.error(error);
            return [403, { 'content-type': 'application/json' }, [JSON.stringify({ error: 'Invalid signature' })]];
        }

        try {
            const matches = event.type.match(/^customer\.subscription\.(created|deleted)$/);
            if(matches){
                const type = matches[1];
                const { customer: customerId } = event.data.object;
                const { metadata: { sintraUserId } } = await this.stripe.customers.retrieve(customerId);
                await this.database.users.where({ id: sintraUserId }).update({
                    membershipTier: type == 'created' ?  'paid' : 'none',
                });
            }
        } catch (error) {
            console.error(error);
            return [500, { 'content-type': 'application/json' }, [JSON.stringify({ error: 'Internal server error' })]];
        }

        return [200, { 'content-type': 'application/json' }, [JSON.stringify({ success: true })]];
    }
}
