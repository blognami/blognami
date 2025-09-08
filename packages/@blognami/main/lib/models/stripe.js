
import * as crypto from 'crypto';

export default {
    meta(){
        this.include('singleton');

        this.on('before:insert', function(){
            if(this.webhookSecret) return;
            this.webhookSecret = crypto.randomUUID();
        });

        this.on('sync_with_subscribable', (stripe, subscribable) => {
            const { id, paidSubscriptionTiers = [] } = subscribable;
            // Sync the subscribable with Stripe
        });
    }
};
