
export default {
    meta(){
        this.schedule('*/5 * * * *');
    },

    minutesUntilExpiry: 30,

    async run(){
        await this.database.withoutTenantScope.usedHashes.where({
            expiresAtLt: new Date()
        }).delete();
    }
};
