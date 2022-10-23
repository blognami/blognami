
export default {
    meta(){
        this.include('pageable');

        this.hasMany('posts');
    }
};
