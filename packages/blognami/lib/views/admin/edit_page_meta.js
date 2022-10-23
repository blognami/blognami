
export default {
    async render(){
        return this.renderForm(this.database.pages.where({ id: this.params.id }).first(), {
            fields: ['slug', 'published'],
            success({ slug }){
                return this.renderHtml`
                    <span data-component="pinstripe-anchor" data-href="/${slug}" data-target="_top" data-trigger="click"></span>
                `;
            }
        })
    }
};
