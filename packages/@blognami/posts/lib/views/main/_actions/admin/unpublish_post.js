
export default {
    async render(){
        await this.database.posts.where({ id: this.params.id }).update({
            published: false,
        });
        
        return this.renderHtml`
            <span data-component="pinstripe-anchor" data-target="_top"><script type="pinstripe">this.parent.trigger('click');</script></span>
        `;
    }
};
