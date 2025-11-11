export default {
    async render(){
        const { id } = this.params;
        const user = await this.session.user;
        const comment = await this.database.comments.where({ id }).first();
        if(!comment || (comment.userId != user.id && user.role != 'admin')) return this.renderView('_403', {
            message: 'You cannot edit this comment.'
        });
        return this.renderForm(comment, {
            fields: [
                { name: 'revisionUserId', type: 'forced', value: this.session.user.id },
                {
                    name: 'body',
                    type: '_markdown_editor',
                    overlayLinks: user.role == 'admin' ? [ { href: `/_actions/admin/revisions?revisableId=${comment.id}&name=body`, 'data-test-id': 'revisions', body: 'Revisions' } ] : undefined,
                }
            ],
            success: this.success.bind(this)
        });
    },

    async success(){
        return this.renderRedirect({ target: '_top' });
    }
}