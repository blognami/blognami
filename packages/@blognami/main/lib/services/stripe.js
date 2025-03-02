
import { Stripe } from 'stripe';

export default {
    create(){
        return this.defer(async () => {
            const create = secretKey => Object.assign(new Stripe(secretKey), {
                withSecretKey(secretKey){
                    return create(secretKey);
                }
            });

            return create(await this.database.stripe.secretKey);
        });
    }
};