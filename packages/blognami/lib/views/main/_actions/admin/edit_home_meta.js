
export default {
    async render(){
        const home = await this.database.home;

        return this.renderForm(home, {
            fields: ['metaTitle', 'metaDescription']
        });
    }
}
