
export default {
    meta(){
        this.annotate({
            description: 'Initializes the database by running migrations and seeding data.'
        });
    },

    async run(){
        await this.runCommand('migrate-database');
        await this.runCommand('seed-database');
    }
}
