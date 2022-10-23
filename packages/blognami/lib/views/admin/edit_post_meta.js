
export default {
    async render(){
        const that = this;

        return this.renderForm(this.database.posts.where({ id: this.params.id }).first(), {
            fields: ['slug', { name: 'tags', type: 'textarea'}, 'featured', 'published'],
            success({ slug }){
                return that.renderHtml`
                    <span data-component="pinstripe-anchor" data-href="/${slug}" data-target="_top" data-trigger="click"></span>
                `;
            }
        });
    }
};
