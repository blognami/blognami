export default {
    create(){
        return this;
    },

    async stripeIsConfiguredCorrectly(){
        try {
            await this.stripe.products.list({
                limit: 1,
            });
            return true;
        } catch (error) {
            return false;
        }
    },
    
    async syncWithStripe(){
        const { data: products } = await this.stripe.products.search({
            query: 'metadata[\'blognamiType\']:\'membership\'',
        });

        let product = products[0];

        if(!product){
            product = await this.stripe.products.create({
                name: 'Membership',
                metadata: {
                    blognamiType: 'membership',
                },
            });
        }

        console.log(JSON.stringify(product, null, 2));
    },

    async userHasAccessTo(access){
        if(access == 'public') return true;

        let user;
        if(await this.session){
            user = await this.session.user;
        }

        if(access == 'free' &&  ['free', 'monthly', 'yearly'].includes(user?.membershipTier)) return true;
        if(access == 'paid' &&  ['monthly', 'yearly'].includes(user?.membershipTier)) return true;

        return false;
    }
};