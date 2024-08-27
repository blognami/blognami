
export default {
    render(){
        return this.renderForm(this.database.membershipTiers, {
            fields: ['name', 'monthlyPrice', 'yearlyPrice'],
        });
    }
};
