
export default {
    meta(){
        this.schedule('* * * * 5'); // run every 5 minutes

        this.whereTenant({ hosts: { name: 'blognami.com' } });
    },

    async run(){
        const now = new Date();

        await this.database.tenants.where({
            subscriptionTier: 'demo',
            lifecycleStatus: 'active',
            subscriptionExpiresAtLt: now
        }).update({ lifecycleStatus: 'paused' });
    }
};
