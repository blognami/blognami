
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    <a href="/_actions/admin/find_page" target="_overlay" data-test-id="find-page">Page</a>
                    <a href="/_actions/admin/find_post" target="_overlay" data-test-id="find-post">Post</a>
                    <a href="/_actions/admin/find_tag" target="_overlay" data-test-id="find-tag">Tag</a>
                    <a href="/_actions/admin/find_user" target="_overlay" data-test-id="find-user">User</a>
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
}
