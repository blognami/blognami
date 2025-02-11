
export default {
    meta(){
        this.schedule('*/5 * * * *');
    },

    async run(){
        await this.database.usedHashes.where({
            expiresAtLt: new Date()
        }).delete();
    }
};
