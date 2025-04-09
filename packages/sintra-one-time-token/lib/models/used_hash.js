
export default {
    meta(){
        this.mustNotBeBlank('value');
        this.mustNotBeBlank('expiresAt');
    }
};
