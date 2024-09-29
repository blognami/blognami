
export default {
    async render(){
        const { webhookSecret } = await this.database.stripe;

        const stripeSignature = this.params._headers['stripe-signature'];

        let event;

        try {
            event = await this.stripe.webhooks.constructEvent(this.params._request.body, stripeSignature, webhookSecret);
        } catch (error) {
            console.error(error);
            return [403, { 'content-type': 'application/json' }, [JSON.stringify({ error: 'Invalid signature' })]];
        }

        if(event.type == 'checkout.session.completed'){
            console.log(JSON.stringify(event, null, 2));
        }
    }
}
