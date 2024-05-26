
export default {
    meta(){
        this.include('pageable');

        this.hasMany('tagableTags');
        this.hasMany('tagables', { through: ['tagableTags', 'tagable'] });

        this.mustNotBeBlank('name');
    }
};
