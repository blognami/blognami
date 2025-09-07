
export default {
    meta(){
        this.include('commentable');
        this.include('revisable');
        
        this.belongsTo('commentable');
        this.belongsTo('user');
        
        this.mustNotBeBlank('commentableId');
        this.mustNotBeBlank('userId');
        this.mustNotBeBlank('body');

        this.on('validation', async function(){
            const rootCommentable = await this.rootCommentable;
            if(typeof rootCommentable.enableComments != 'boolean') return;
            if(!rootCommentable.enableComments && !this.isValidationError('general')){
                this.setValidationError('general', `Comments have not been enabled.`);
            }
        });

        this.on('before:validation', function(){
            if(!this.createdAt){
                this.createdAt = new Date();
            }
        });

        this.trackRevisionsFor('body');
    }
};
