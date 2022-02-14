
export default {
    abstract: true,

    meta(){
        this.canBe('tagable');

        this.hasMany('tagableTags', { fromKey: 'id', toKey: 'tagableId' });
        this.hasMany('tags', { through: ['tagableTags', 'tag'] });

        this.afterInsertOrUpdate(async function(){
            if(typeof this._tags != 'string') return;
            const tags = this._tags.split(/\n/).map(tag => tag.trim().replace(/\s+/g, ' ')).filter(tag => tag != '');
            const tagIds = [];
            while(tags.length > 0){
                const name = tags.shift();
                const tag = await this._database.tags.nameEq(name).first();
                if(tag){
                    tagIds.push(tag.id)
                } else {
                    tagIds.push(await this._database.tags.insert({ name }).id);
                }
            }

            await this.tagableTags.delete();
            
            while(tagIds.length){
                await this._database.tagableTags.insert({
                    tagableId: this.id,
                    tagId: tagIds.shift()
                });
            }
        });

        this.scope('taggedWith', (tagables, ...tagNames) => {
            let out = tagables;
            tagNames.forEach(tagName => {
                out = out.tags.nameEq(tagName).back(2);
            });
            return out;
        });
    },

    set tags(tags){
        this._tags = tags;
    }
};
