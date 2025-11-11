export default {
    meta(){
        this.belongsTo('user');

        this.mustNotBeBlank('userId');
        this.mustNotBeBlank('passString');
    }
};