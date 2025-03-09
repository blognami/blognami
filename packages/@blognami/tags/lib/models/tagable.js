
export default {
    meta(){
        this.hasMany('tagableTags', { fromKey: 'id', toKey: 'tagableId' });
        this.hasMany('tags', { through: ['tagableTags', 'tag'] });
    }
};
