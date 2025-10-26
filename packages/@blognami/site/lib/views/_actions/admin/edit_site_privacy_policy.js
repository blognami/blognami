export default {
    async render(){
        return this.renderForm(this.database.site, {
            fields: [
                {  
                    name: 'privacyPolicy',
                    type: '_markdown_editor'
                }
            ],
        });
    }
}