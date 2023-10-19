
export default {
    meta(){
        this.hasMany('tagableTags', { fromKey: 'id', toKey: 'tagableId' });
        this.hasMany('tags', { through: ['tagableTags', 'tag'] });

        this.afterInsertOrUpdate(async function(){
            if(typeof this._tags != 'string') return;
            const tags = this._tags.split(/\n/).map(tag => tag.trim().replace(/\s+/g, ' ')).filter(tag => tag != '');
            const tagIds = [];
            while(tags.length > 0){
                const name = tags.shift();
                const tag = await this.database.tags.where({ name }).first();
                if(tag){
                    tagIds.push(tag.id)
                } else {
                    tagIds.push((await this.database.tags.insert({ name })).id);
                }
            }

            await this.tagableTags.delete();
            
            while(tagIds.length){
                await this.database.tagableTags.insert({
                    tagableId: this.id,
                    tagId: tagIds.shift()
                });
            }
        });

        this.scope('taggedWith', function(tagNames){
            [ tagNames ].flat().forEach(tagName => this.tags.where({ name: tagName }));
        });
    },

    set tags(tags){
        this._tags = tags;
    }
};
