
export default {
    meta(){
        this.belongsTo('user')

        this.mustNotBeBlank('passString')
        this.mustNotBeBlank('userId')
    }
};
