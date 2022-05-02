
export default {
    meta(){
        this.mustNotBeBlank('name');
        this.mustNotBeBlank('host');
    }
};
