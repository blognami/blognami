
export default {
    meta(){
        this.addHook('beforeInsert', function(){
            if(this.subscriptionTier) return;
            this.subscriptionTier = 'demo';
            this.subscriptionExpiresAt = new Date(Date.now() + this.demoSeconds);
        });
    },

    demoSeconds: 3 * 24 * 60 * 60 * 1000, // 3 days
};
