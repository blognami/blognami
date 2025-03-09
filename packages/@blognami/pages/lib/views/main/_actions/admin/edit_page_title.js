
export default {
    async render(){
        return this.renderForm(this.database.pages.where({ id: this.params.id }).first(), {
            fields: ['title']
        });
    }
};
