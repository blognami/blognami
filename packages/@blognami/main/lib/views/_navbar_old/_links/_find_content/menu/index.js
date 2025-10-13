
export default {
    async render(){
        if(await this.isSignedOut) return;

        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    ${this.renderViews('_navbar/_links/_find_content/menu/_*')}
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
}
