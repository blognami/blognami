
export default {
    async render(){
        const that = this;

        const { enableFree, enableMonthly, enableYearly } = await this.database.newsletter;

        const accessField = {
            name: 'access',
            type: 'select',
            options: (() => {
                const out = { public: 'Public' };
                if(enableFree) out.free = 'Members only';
                if(enableMonthly || enableYearly) out.paid = 'Paid members only';
                return out;
            })()
        };

        return this.renderForm(this.database.pages.where({ id: this.params.id }).first(), {
            fields: [accessField, 'metaTitle', 'metaDescription', 'slug', 'published'],
            success({ slug }){
                return that.renderRedirect({
                    url: `/${slug}`,
                    target: '_top'
                });
            }
        })
    }
};
