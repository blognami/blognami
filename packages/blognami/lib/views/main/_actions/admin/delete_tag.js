
export default {
    async render(){
        await this.database.tags.where({ id: this.params.id }).delete();
        
        return this.renderHtml`
            <span data-component="pinstripe-anchor" data-target="_top"><script type="pinstripe">this.parent.trigger('click');</script></span>
        `;
    }
};
