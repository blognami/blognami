
export default {
    async render(){
        await this.database.pages.where({ id: this.params.id }).delete();
        
        return this.renderRedirect({ target: '_top' });
    }
};
