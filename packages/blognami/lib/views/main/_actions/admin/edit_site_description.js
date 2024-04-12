
export default {
    async render(){
        const site = await this.database.site;

        return this.renderForm(site, {
            fields: [
                { name: 'revisionUserId', type: 'forced', value: this.session.user.id },
                {  
                    name: 'description',
                    type: '_markdown_editor',
                    overlayLinks: [ { href: `/_actions/admin/revisions?revisableId=${site.id}&name=description`, 'data-test-id': 'revisions', body: 'Revisions' } ]
                }
            ]
        });
    }
}
