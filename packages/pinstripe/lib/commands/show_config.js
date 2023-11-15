
export default {
    async run(){
        console.log(JSON.stringify(await this.config, null, 2));
    }
};
