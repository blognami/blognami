
export default {
    async run(){
        await this.database.migrate();
    }
};
