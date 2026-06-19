
export const styles = ({ colors, remify }) => `
    .pill {
        display: inline-block;
        padding: ${remify(2)} ${remify(10)};
        margin-right: ${remify(4)};
        font-size: ${remify(13)};
        line-height: 1.5;
        border-radius: ${remify(999)};
        background-color: ${colors.lime[100]};
        border: ${remify(1)} solid ${colors.lime[300]};
        color: ${colors.lime[900]};
    }
`;

export default {
    render(){
        const { tagable } = this.params;
        return this.renderView('_editable_area', {
            url: `/_actions/admin/edit_tagable_tags?id=${tagable.id}`,
            body: this.renderHtml`
                <p><b>Tags:</b> ${async () => {
                    const tags = await tagable.tags.orderBy('name').all();
                    if(tags.length === 0) return 'none';
                    return tags.map(({ name }) => this.renderHtml`<span class="${this.cssClasses.pill}">${name}</span>`);
                }}</p>
            `,
            linkTestId: "edit-tagable-tags",
            bodyTestId: "tagable-tags"
        })
    }
};
