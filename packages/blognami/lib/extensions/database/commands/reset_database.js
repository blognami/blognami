
export default {
    async run(){
        await this.runCommand('drop-database');
        await this.runCommand('initialize-database');
    }
};
