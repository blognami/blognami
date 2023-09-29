
export default {
    async render(){
        const that = this;

        return this.renderForm(this.database.pages.where({ id: this.params.id }).first(), {
            fields: ['slug', 'published'],
            success({ slug }){
                return that.renderHtml`
                    <span data-component="a" data-href="/${slug}" data-target="_top"><script type="pinstripe">this.parent.trigger('click');</script></span>
                `;
            }
        })
    }
};
