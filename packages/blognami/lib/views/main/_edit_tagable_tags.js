
export default {
    render(){
        const { tagable } = this.params;
        return this.renderView('_editable_area', {
            url: `/_actions/admin/edit_tagable_tags?id=${tagable.id}`,
            body: this.renderHtml`
                <p><b>Tags:</b> ${async () => {
                    const tags = await tagable.tags.orderBy('name').all().map(({ name }) => `"${name}"`).join(', ');
                    if(tags) return tags;
                    return 'none';
                }}</p>
            `,
            linkTestId: "edit-tagable-tags",
            bodyTestId: "tagable-tags"
        })
    }
};
