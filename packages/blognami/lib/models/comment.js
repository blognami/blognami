
export default {
    meta(){
        this.include('commentable');
        
        this.belongsTo('commentable');
        this.belongsTo('user');
        
        this.mustNotBeBlank('commentableId');
        this.mustNotBeBlank('userId');
        this.mustNotBeBlank('body');

        this.validateWith(async function(){
            const rootCommentable = await this.rootCommentable;
            if(typeof rootCommentable.enableComments != 'boolean') return;
            if(!rootCommentable.enableComments && !this.isValidationError('general')){
                this.setValidationError('general', `Comments have not been enabled.`);
            }
        });

        this.beforeValidation(function(){
            if(!this.createdAt){
                this.createdAt = new Date();
            }
        });
    }
};
