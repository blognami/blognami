
export default {
    async run(){
        await this.database.drop()
    }
};
