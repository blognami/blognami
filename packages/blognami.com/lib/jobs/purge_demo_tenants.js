
import { Row } from '@pinstripe/database';

export default {
    meta(){
        this.schedule('* * * * 5'); // run every 5 minutes

        this.whereTenant({ hosts: { name: 'blognami.com' } });
    },

    async run(){
        const { retentionDays } = Row.for('tenant').prototype;
        const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

        await this.database.tenants.where({
            subscriptionTier: 'demo',
            lifecycleStatus: 'paused',
            subscriptionExpiresAtLt: cutoff
        }).delete();
    }
};
