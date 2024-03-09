
export default {
    async render(){
        return this.renderForm(this.database.posts.where({ id: this.params.id }).first(), {
            fields: [
                { name: 'revisionUserId', type: 'forced', value: this.session.user.id },
                { name: 'body', type: '_markdown_editor' }
            ]
        });
    }
};
