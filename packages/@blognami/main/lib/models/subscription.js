
export default {
    meta(){
        this.belongsTo('subscribable');
        this.belongsTo('user');

        this.mustNotBeBlank('tier');
        this.mustMatchPattern('tier', /^(free|paid)$/);
    }
}
