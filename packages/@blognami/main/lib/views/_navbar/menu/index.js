

export default {
    async render(){
        const path = JSON.parse(this.params.path || '[]');

        const items = await this.menus.user || [];

        let currentItems = items;
        for(const label of path){
            currentItems = currentItems.find(item => item.label === label)?.children;
            if(!currentItems){
                return;
            }
        }

        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    ${currentItems.map(item => this.renderView('_navbar/menu/_link', item))}
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
};
