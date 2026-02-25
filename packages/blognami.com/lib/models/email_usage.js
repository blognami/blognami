
export default {
    meta(){
        this.include('untenantable');
        this.belongsTo('tenant');
    },

    async incrementBy(count){
        await this.update({ emailsSent: this.emailsSent + count });
    },

    get allowanceExceeded(){
        return this.tenant.then(tenant => {
            return this.emailsSent >= tenant.monthlyEmailAllowance;
        });
    }
};
