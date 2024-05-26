
export default {
    render(){
        const that = this;
        
        return this.renderForm(this.database.tags, {
            fields: ['name'],
            success({ slug }){
                return that.renderHtml`
                    <span data-component="pinstripe-anchor" data-href="/${slug}" data-target="_top"><script type="pinstripe">this.parent.trigger('click');</script></span>
                `;
            }
        });
    }
};
