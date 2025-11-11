export default {
    meta(){
        this.belongsTo('revisable');

        this.mustNotBeBlank('revisableId');
        this.mustNotBeBlank('userId');
        this.mustNotBeBlank('name');

        this.addHook('beforeValidation', function(){
            if(!this.createdAt){
                this.createdAt = new Date();
            }
        });
    }
};