
export default {
    async render(){
        const that = this;

        return this.renderForm(this.database.stripe, {
            fields: [{ name: 'secretKey', type: 'password' }],

            async validateWith(){
                if(!this.isValidationError('secretKey')){
                    try {
                        await that.stripe.withSecretKey(this.secretKey).products.list({
                            limit: 1,
                        });
                    } catch (error) {
                        this.setValidationError('secretKey', 'Invalid secret key.');
                    }
                }
            }
        });
    }
}
