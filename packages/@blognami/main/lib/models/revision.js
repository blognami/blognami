
export default {
    meta(){
        this.belongsTo('revisable');

        this.mustNotBeBlank('revisableId');
        this.mustNotBeBlank('userId');
        this.mustNotBeBlank('name');

        this.on('before:validation', function(){
            if(!this.createdAt){
                this.createdAt = new Date();
            }
        });
    }
};
