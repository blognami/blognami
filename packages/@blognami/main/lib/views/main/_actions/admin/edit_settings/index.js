
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    <a href="/_actions/admin/edit_membership_tiers" target="_overlay" data-test-id="edit-site-membership">Membership tiers</a>
                    <a href="/_actions/admin/edit_site_meta" target="_overlay" data-test-id="edit-site-meta">Site</a>
                    <a href="/_actions/admin/edit_stripe" target="_overlay" data-test-id="edit-stripe">Stripe</a>
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
}
