
export default {
    meta(){
        this.annotate({
            description: 'Resets the database by dropping it completely and then reinitializing with migrations and seeds. Use with caution!'
        });
    },

    async run(){
        await this.runCommand('drop-database');
        await this.runCommand('initialize-database');
    }
};
