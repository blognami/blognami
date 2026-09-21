
export default {
    meta(){
        this.include('pageable');
        this.include('sitemappable');

        this.hasMany('tagableTags');
        this.hasMany('tagables', { through: ['tagableTags', 'tagable'] });

        this.mustNotBeBlank('name');
    }
};
