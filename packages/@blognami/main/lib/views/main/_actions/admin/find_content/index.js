
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    ${this.renderViews('_actions/admin/find_content/_*')}
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
}
