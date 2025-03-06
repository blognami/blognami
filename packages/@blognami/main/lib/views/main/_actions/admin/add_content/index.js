
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    <a href="/_actions/admin/add_page" target="_overlay" data-test-id="add-page">Page</a>
                    <a href="/_actions/admin/add_post" target="_overlay" data-test-id="add-post">Post</a>
                    <a href="/_actions/admin/add_tag" target="_overlay" data-test-id="add-tag">Tag</a>
                    <a href="/_actions/admin/add_user" target="_overlay" data-test-id="add-user">User</a>
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
}
