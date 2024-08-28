
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                ${this.renderView('_menu', {
                    items: [
                        { href: `/_actions/admin/edit_site_meta`, target: '_overlay', body: 'Site', testId: 'edit-site-meta'},
                        { href: `/_actions/admin/edit_site_membership`, target: '_overlay', body: 'Membership', testId: 'edit-site-membership'},
                    ]
                })}
            </pinstripe-popover>
        `;
    }
}
