
export default {
    async render(){
        return this.renderForm(this.database.site, {
            fields: ['title']
        });
    }
}
