
export default {
    async render(){
        const that = this;

        return this.renderForm(this.database.posts.where({ id: this.params.id }).first(), {
            fields: ['slug', 'featured', 'published', 'enableComments'],
            success({ slug }){
                return that.renderHtml`
                    <span data-component="pinstripe-anchor" data-href="/${slug}" data-target="_top"><script type="pinstripe">this.parent.trigger('click');</script></span>
                `;
            }
        });
    }
};
