
export default {
    async render(){
        return this.renderForm(this.database.site, {
            fields: [{ name: 'description', type: 'markdown/_input' }]
        });
    }
}
