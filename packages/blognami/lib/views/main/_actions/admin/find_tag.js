
export default {
    async render(){
        return this.renderTable(
            this.database.tags.orderBy('name').paginate(this.params.page),
            {
                search: ['name'],
                columns: [
                    {
                        name: 'name',
                        cell: ({ slug, name}) => this.renderHtml`
                            <a href="/${slug}" target="_top">${name}</a>
                        `
                    }
                ]
            }
        );
    }
};
