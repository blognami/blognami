
export default {
    meta(){
        this.hasMany('tagableTags', { fromKey: 'id', toKey: 'tagableId' });
        this.hasMany('tags', { through: ['tagableTags', 'tag'] });

        this.scope('taggedWith', function(tagNames){
            [ tagNames ].flat().forEach(tagName => this.tags.where({ name: tagName }));
        });
    }
};
