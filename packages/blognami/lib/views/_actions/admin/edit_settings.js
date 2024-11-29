
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                ${this.renderView('_menu', {
                    items: [
                        { href: `/_actions/admin/edit_membership_tiers`, target: '_overlay', body: 'Membership tiers', testId: 'edit-site-membership'},
                        { href: `/_actions/admin/edit_site_meta`, target: '_overlay', body: 'Site', testId: 'edit-site-meta'},
                        { href: `/_actions/admin/edit_stripe`, target: '_overlay', body: 'Stripe', testId: 'edit-stripe'},
                    ]
                })}
            </pinstripe-popover>
        `;
    }
}
