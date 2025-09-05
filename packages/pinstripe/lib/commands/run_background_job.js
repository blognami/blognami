
export default {
    async run(){
        const { name = '' } = this.params;
        if(name == ''){
            console.error('A background job --name must be given.');
            process.exit();
        }
        this.runBackgroundJob(name);
    }
};
