
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    ${this.renderViews('_navbar/_links/_add_content/menu/_*')}
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
}
