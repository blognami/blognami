

export default {
    render(){
        const path = JSON.parse(this.params.path || '[]');

        const items = this.menus.navbar || [];

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
                    ${currentItems.map(({ partial, ...item}) => this.renderView(partial, item))}
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
};
