
export default {
    async render(){
        return this.renderForm(this.database.site, {
            fields: [{ name: 'description', type: 'textarea', component: 'pinstripe-markdown-editor/anchor' }]
        });
    }
}
