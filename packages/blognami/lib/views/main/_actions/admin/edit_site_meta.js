
export default {
    async render(){
        const site = await this.database.site;

        return this.renderForm(site, {
            fields: ['title']
        });
    }
}
