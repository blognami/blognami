
export default {
    async render(){
        const { id, name } = this.params;
        const normalizedName = `${name ?? ''}`.trim();

        if(normalizedName){
            let tag = await this.database.tags.where({ name: normalizedName }).first();
            if(!tag) tag = await this.database.tags.insert({ name: normalizedName });
            if(await this.database.tagableTags.where({ tagableId: id, tagId: tag.id }).count() === 0){
                await this.database.tagableTags.insert({ tagableId: id, tagId: tag.id });
            }
        }

        return this.renderRedirect({ target: '_parent' });
    }
};
