
export default {
    meta(){
        this.schedule('*/5 * * * *');
    },

    minutesUntilExpiry: 30,

    async run(){
        await this.database.withoutMultiTenancy.sessions.lastAccessedAtLt(Date.now() - (1000 * 60 * this.minutesUntilExpiry)).delete();
    }
};
