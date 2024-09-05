
import { Stripe } from 'stripe';

export default {
    create(){
        return this.defer(async () => new Stripe(await this.database.stripe.secretKey));
    }
};