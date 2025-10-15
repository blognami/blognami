
export default {
    render(){
        const { label, children: links } = this.params;

        return this.renderView('_sidebar/_section', {
            label,
            testId: `${this.inflector.dasherize(label)}-section`,   
            body: this.renderView('_sidebar/_link_group', { children: links })
        });
    }
}
