
export default {
    async render(){
        const { id, tagId } = this.params;

        if(await this.database.tagableTags.where({ tagableId: id, tagId }).count() > 0){
            await this.database.tagableTags.where({ tagableId: id, tagId }).delete();
        } else {
            await this.database.tagableTags.insert({ tagableId: id, tagId });
        }
        
        return this.renderHtml`
            <span data-component="pinstripe-anchor" data-target="_parent"><script type="pinstripe">this.parent.trigger('click');</script></span>
        `;
    }
};
