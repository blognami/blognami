
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    ${this.renderViews('_navbar/_links/_edit_settings/menu/_*')}
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
}
