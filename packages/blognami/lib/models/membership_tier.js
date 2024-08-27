
export default {
    meta(){
        this.hasMany('membershipTierFeatures');

        this.mustNotBeBlank('name');
        this.mustNotBeBlank('monthlyPrice');
    }
};
