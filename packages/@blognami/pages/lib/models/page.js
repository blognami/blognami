
export default {
    meta(){
        this.include('pageable');
        this.include('revisable');
        
        this.belongsTo('user');

        this.mustNotBeBlank('userId');
        this.mustNotBeBlank('title');

        this.addHook('beforeValidation', function(){
            if(this.published && !this.publishedAt){
                this.publishedAt = new Date();
            }
        });

        this.trackRevisionsFor('body');
    }
};
