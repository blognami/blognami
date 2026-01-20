
export default {
    meta(){
        this.include('untenantable');
        this.mustNotBeBlank('name');
    }
};
