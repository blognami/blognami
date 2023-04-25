
export default {
    async render(){
        await this.database.posts.where({ id: this.params.id }).delete();
        
        return this.renderHtml`
            <span data-component="a" data-target="_top" data-trigger="click"></span>
        `;
    }
};
