
export default {
    meta(){
        this.annotate({
            description: 'Runs all pending database migrations to update the database schema.'
        });
    },

    async run(){
        await this.database.migrate();
    }
};
