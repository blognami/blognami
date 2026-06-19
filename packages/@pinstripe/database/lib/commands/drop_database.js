
export default {
    meta(){
        this.annotate({
            description: 'Drops the database, removing all tables and data. Use with caution!'
        });
        this.tag('database');
    },

    async run(){
        await this.database.drop();
    }
};
