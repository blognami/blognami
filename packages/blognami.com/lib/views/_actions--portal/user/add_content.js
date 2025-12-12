
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    <a href="/_actions/guest/add_blog" target="_overlay" data-test-id="add-blog">Blog (start free trial)</a>
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
}
