
export default {
    meta(){
        this.annotate({
            description: 'Seeds the database with initial data. By default does nothing - implement seeding logic as needed.'
        });
        this.tag('database');
    },

    run(){
        // do nothing
    }
};
