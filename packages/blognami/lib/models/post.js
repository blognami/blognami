
export default {
    meta(){
        this.include('pageable');
        
        this.belongsTo('user');

        this.mustNotBeBlank('userId');
        this.mustNotBeBlank('title');

        this.beforeValidation(function(){
            if(this.published && !this.publishedAt){
                this.publishedAt = new Date();
            }
        })
    }
};
