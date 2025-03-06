
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    ${this.renderViews('_actions/admin/your_account/_*')}
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
}
