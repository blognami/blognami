
export default {
    async render(){
        return this.renderForm(this.database.site, {
            fields: [
                { name: 'revisionUserId', type: 'forced', value: this.session.user.id },
                {  
                    name: 'description',
                    type: '_markdown_editor',
                    overlayLinks: [ { href: '/_actions/admin/revisions', body: 'Revisions' } ]
                }
            ]
        });
    }
}
