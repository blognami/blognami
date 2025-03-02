
export const decorators = {
    wrapper(){
        this.on('close', (event) => {
            event.stopPropagation();
            this.frame.frame.load();
        });
    }
};

export default {
    async render(){
        const { id } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.wrapper}">
                ${this.renderTable(
                    this.database.tags.orderBy('name').paginate(this.params.page),
                    {
                        search: ['name'],
                        columns: [
                            {
                                name: 'name',
                                title: 'Name',
                                cell: ({ name, id: tagId }) => this.renderHtml`
                                    <a
                                        target="_overlay"
                                        data-method="post"
                                        href="/_actions/admin/toggle_tagable_tag?id=${id}&tagId=${tagId}"
                                    >${name}</a>
                                `
                            },
                            {
                                name: 'tagged',
                                title: 'Tagged?',
                                cell: ({ id: tagId }) => async () => {
                                    const tag = await this.database.tagableTags.where({ tagId, tagableId: id }).first();
                                    return this.renderHtml`
                                        <input
                                            type="checkbox" 
                                            ${tag ? 'checked' : ''}
                                            data-component="pinstripe-anchor"
                                            data-target="_overlay"
                                            data-method="post"
                                            data-href="/_actions/admin/toggle_tagable_tag?id=${id}&tagId=${tagId}"
                                        >
                                    `;
                                }
                            }
                        ]
                    }
                )}
            </div>
        `
    }
};
