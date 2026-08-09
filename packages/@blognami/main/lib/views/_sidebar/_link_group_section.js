
const countLinks = items => (items || []).reduce(
    (total, item) => total + (item.url ? 1 : 0) + countLinks(item.children), 0
);

export default {
    render(){
        const { label, testId, children: links } = this.params;

        return this.renderView('_sidebar/_section', {
            label,
            testId,
            count: countLinks(links),
            body: this.renderView('_sidebar/_link_group', { children: links })
        });
    }
}
