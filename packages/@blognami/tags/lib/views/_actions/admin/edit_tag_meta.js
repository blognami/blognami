
export default {
    async render(){
        const that = this;

        return this.renderForm(this.database.tags.where({ id: this.params.id }).first(), {
            fields: ['name', 'metaTitle', 'metaDescription', 'slug'],
            success({ slug }){
                return that.renderRedirect({
                    url: `/${slug}`,
                    target: '_top'
                });
            }
        })
    }
};
