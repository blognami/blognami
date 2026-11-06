
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

        const post = await this.database.posts.where({ id: this.params.id }).first();
        const featuredImage = await post.featuredImage;

        return this.renderForm(post, {
            fields: [
                accessField,
                'metaTitle',
                'metaDescription',
                'slug',
                'enableComments',
                {
                    name: 'featured',
                    type: '_admin/_image_field',
                    label: 'Featured image',
                    hint: 'Wide, at least 1200×675.',
                    image: featuredImage
                },
                ...(post.featuredImageId ? [{ name: 'removeFeatured', type: 'checkbox', label: 'Remove featured image' }] : [])
            ],
            success({ slug }){
                return that.renderRedirect({
                    url: `/${slug}`,
                    target: '_top'
                });
            }
        });
    }
};
