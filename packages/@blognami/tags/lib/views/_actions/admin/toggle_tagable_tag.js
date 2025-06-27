
export default {
    async render(){
        const { id, tagId } = this.params;

        if(await this.database.tagableTags.where({ tagableId: id, tagId }).count() > 0){
            await this.database.tagableTags.where({ tagableId: id, tagId }).delete();
        } else {
            await this.database.tagableTags.insert({ tagableId: id, tagId });
        }
        
        return this.renderRedirect({ target: '_parent' });
    }
};
