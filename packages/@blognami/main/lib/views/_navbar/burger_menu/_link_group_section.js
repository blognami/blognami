
export default {
    render(){
        const { label, testId, children: links } = this.params;

        return this.renderView('_navbar/burger_menu/_section', {
            label,
            testId,   
            body: this.renderView('_navbar/burger_menu/_link_group', { children: links })
        });
    }
}
