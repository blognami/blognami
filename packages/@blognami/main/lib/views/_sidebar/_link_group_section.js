
export default {
    render(){
        const { label, testId, children: links } = this.params;

        return this.renderView('_sidebar/_section', {
            label,
            testId,   
            body: this.renderView('_sidebar/_link_group', { children: links })
        });
    }
}
