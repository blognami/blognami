
export default {
    async render(){
        return this.renderForm(this.database.site, {
            fields: [
                { name: 'revisionUserId', type: 'forced', value: this.session.user.id },
                { name: 'description', type: '_markdown_editor' }
            ]
        });
    }
}
