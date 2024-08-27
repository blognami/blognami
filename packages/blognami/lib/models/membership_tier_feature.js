
export default {
    meta(){
        this.belongsTo('membershipTier');
        
        this.mustNotBeBlank('membershipTierId');
        this.mustNotBeBlank('name');
    }
};
