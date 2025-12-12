
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    <a href="/_actions/user/find_blog" target="_overlay" data-test-id="find-blog">Blog</a>
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
}
