
const WORDS_PER_MINUTE = 275;

export default {
    meta(){
        this.include('pageable');
        this.include('sitemappable');
        this.include('tagable');
        this.include('commentable');
        this.include('revisable');
        this.include('imageable');

        this.belongsTo('user');
        this.belongsTo('featuredImage', { collectionName: 'images' });

        this.mustNotBeBlank('userId');
        this.mustNotBeBlank('title');

        this.addHook('beforeValidation', function(){
            if(this.published && !this.publishedAt){
                this.publishedAt = new Date();
            }
        });

        this.addHook('beforeDelete', async function(){
            if(!this.featuredImageId) return;
            const featuredImage = await this.database.images.where({ id: this.featuredImageId }).first();
            if(featuredImage) await featuredImage.delete();
        });

        this.scope('usedAsSitemappable', function(enabled = false){
            if(!enabled) return;
            return this.where({ published: true, access: 'public' });
        });

        this.trackRevisionsFor('body');
        this.addImageField('featured');
    },

    set featured(file){
        this.buildPendingImage('featured', file);
    },

    set removeFeatured(value){
        this._removeFeatured = `${value}` == 'true';
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
