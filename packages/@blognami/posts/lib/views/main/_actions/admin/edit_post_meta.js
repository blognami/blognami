
export default {
    async render(){
        const that = this;

        const { enableFree, enableMonthly, enableYearly } = await this.database.membershipTiers;

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

        return this.renderForm(this.database.posts.where({ id: this.params.id }).first(), {
            fields: [accessField, 'metaTitle', 'metaDescription', 'slug', 'featured', 'enableComments'],
            success({ slug }){
                return that.renderHtml`
                    <span data-component="pinstripe-anchor" data-href="/${slug}" data-target="_top"><script type="pinstripe">this.parent.trigger('click');</script></span>
                `;
            }
        });
    }
};
