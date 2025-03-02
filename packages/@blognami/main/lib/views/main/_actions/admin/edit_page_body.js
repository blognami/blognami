
export default {
    async render() {
        const page = await this.database.pages.where({ id: this.params.id }).first()

        return this.renderForm(page, {
            fields: [
                { name: 'revisionUserId', type: 'forced', value: this.session.user.id },
                { 
                    name: 'body',
                    type: '_markdown_editor',
                    overlayLinks: [ { href: `/_actions/admin/revisions?revisableId=${page.id}&name=body`, 'data-test-id': 'revisions', body: 'Revisions' } ]
                }
            ]
        });
    }
};
