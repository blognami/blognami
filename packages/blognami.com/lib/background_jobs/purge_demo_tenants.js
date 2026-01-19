
export default {
    meta(){
        this.schedule('* * * * 5'); // run every 5 minutes

        this.whereTenant({ name: 'portal' });
    },

    async run(){
        const now = new Date();

        await this.database.tenants.where({
            subscriptionTier: 'demo',
            subscriptionExpiresAtLt: now
        }).delete();
    }
};
