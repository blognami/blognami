
export default {
    async render(){
        await this.database.tags.where({ id: this.params.id }).delete();
        
        return this.renderRedirect({ target: '_top' });
    }
};
