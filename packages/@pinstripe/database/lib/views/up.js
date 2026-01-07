
export default {
    meta(){
        this.addHook('check', async function(){
            await this.database.ping();
        });
    }
};
