
export default {
    async render(){
        await this.database.posts.where({ id: this.params.id }).update({
            published: false,
        });
        
        return this.renderRedirect({ target: '_top' });
    }
};
