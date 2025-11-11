
const WORDS_PER_MINUTE = 275;

export default {
    meta(){
        this.include('pageable');
        this.include('tagable');
        this.include('commentable');
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
    },

    get readingMinutes(){
        const body = this.body || '';
        const wordCount = body.replace(/\W/g, ' ').trim().split(/\s+/).length;
        return Math.ceil(wordCount / WORDS_PER_MINUTE);
    },

    get excerptFromBody(){
        const body = this.body || '';
        return `${body.replace(/\W/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 252)}...`
    }    
};
