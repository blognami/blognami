export default {
    meta(){
        this.mustNotBeBlank('name');
        this.mustNotBeBlank('type');
        this.mustNotBeBlank('stripeProductId');
    }
};
