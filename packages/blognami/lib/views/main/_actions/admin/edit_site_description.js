
export default {
    async render(){
        return this.renderForm(this.database.site, {
            fields: [{ name: 'description', type: '_markdown_editor' }]
        });
    }
}
