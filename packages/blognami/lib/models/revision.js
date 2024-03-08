
export default {
    meta(){
        this.mustNotBeBlank('revisableId');
        this.mustNotBeBlank('name');

        this.beforeValidation(function(){
            if(!this.createdAt){
                this.createdAt = new Date();
            }
        });
    }
};
