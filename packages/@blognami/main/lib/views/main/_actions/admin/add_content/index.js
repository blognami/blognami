
export default {
    render(){
        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    ${this.matchViews('_actions/admin/add_content/_*').map(name => this.renderView(name))}
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
}
