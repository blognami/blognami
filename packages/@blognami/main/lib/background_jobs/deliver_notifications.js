
export default {
    meta(){
        this.schedule('*/5 * * * *');
    },

    async run(){
        for (let user of await this.database.users.where({ readyToDeliverNotifications: true }).all()){
            await user.deliverNotifications();
        }
    }
};
