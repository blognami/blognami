
export default {
    async render(){
        const that = this;

        return this.renderForm(this.database.tags.where({ id: this.params.id }).first(), {
            fields: ['name', 'slug'],
            success({ slug }){
                return that.renderHtml`
                    <span data-component="pinstripe-anchor" data-href="/${slug}" data-target="_top"><script type="pinstripe">this.parent.trigger('click');</script></span>
                `;
            }
        })
    }
};
