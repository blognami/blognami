
export default {
    render(){
        const { label, children: links } = this.params;

        return this.renderView('_navbar/burger_menu/_section', {
            label,
            testId: `${this.inflector.dasherize(label)}-section`,   
            body: this.renderView('_navbar/burger_menu/_link_group', { children: links })
        });
    }
}
