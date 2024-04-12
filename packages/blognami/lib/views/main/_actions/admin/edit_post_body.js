
export default {
    async render(){
        const post = await this.database.posts.where({ id: this.params.id }).first();
        return this.renderForm(post, {
            fields: [
                { name: 'revisionUserId', type: 'forced', value: this.session.user.id },
                {
                    name: 'body',
                    type: '_markdown_editor',
                    overlayLinks: [ { href: `/_actions/admin/revisions?revisableId=${post.id}&name=body`, 'data-test-id': 'revisions', body: 'Revisions' } ]
                }
            ]
        });
    }
};
