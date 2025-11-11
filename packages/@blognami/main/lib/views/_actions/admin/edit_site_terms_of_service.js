export default {
    async render(){
        return this.renderForm(this.database.site, {
            fields: [
                {  
                    name: 'termsOfService',
                    type: '_markdown_editor'
                }
            ],
        });
    }
}