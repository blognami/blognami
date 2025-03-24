
export default {
    async render(){
        return this.renderForm(this.database.site, {
            fields: [
                {  
                    name: 'cookiePolicy',
                    type: '_markdown_editor'
                }
            ],
        });
    }
}
