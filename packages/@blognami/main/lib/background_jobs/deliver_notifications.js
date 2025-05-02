
export default {
    meta(){
        this.schedule('* * * * *'); // run every minute
    },

    run(){
        console.log('deliver-notifications background job coming soon!')
    }
};
