
export default {
    meta(){
        this.include('pageable');
        this.include('sitemappable');
        this.include('revisable');
        
        this.belongsTo('user');

        this.mustNotBeBlank('userId');
        this.mustNotBeBlank('title');

        this.addHook('beforeValidation', function(){
            if(this.published && !this.publishedAt){
                this.publishedAt = new Date();
            }
        });

        this.scope('usedAsSitemappable', function(enabled = false){
            if(!enabled) return;
            return this.where({ published: true, access: 'public' });
        });

        this.trackRevisionsFor('body');
    }
};
