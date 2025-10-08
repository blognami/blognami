
export default {
    meta(){
        this.annotate({
            description: 'Drops the database, removing all tables and data. Use with caution!'
        });
    },

    async run(){
        await this.database.drop();
    }
};
