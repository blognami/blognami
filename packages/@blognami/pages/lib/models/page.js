
export default {
    meta(){
        this.include('pageable');
        this.include('revisable');
        
        this.belongsTo('user');

        this.mustNotBeBlank('userId');
        this.mustNotBeBlank('title');

        this.on('beforeValidation', function(){
            if(this.published && !this.publishedAt){
                this.publishedAt = new Date();
            }
        });

        this.trackRevisionsFor('body');
    }
};
