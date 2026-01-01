
export default {
    render(){
        const { label, testId, url, target, children } = this.params;

        // Top-level link: has url but no children
        if (url && (!children || children.length === 0)) {
            return this.renderView('_navbar/burger_menu/_link_group', {
                children: [{ label, url, target, testId }]
            });
        }

        // Section with children: render with heading
        return this.renderView('_navbar/burger_menu/_section', {
            label,
            testId,
            body: this.renderView('_navbar/burger_menu/_link_group', { children })
        });
    }
}
