
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    ${this.renderViews('_actions/admin/edit_settings/_*')}
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
}
