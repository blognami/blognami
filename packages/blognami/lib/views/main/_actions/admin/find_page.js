
export default {
    async render(){
        return this.renderTable(
            this.database.pages.orderBy('title').paginate(this.params.page),
            {
                search: ['title'],
                columns: [
                    {
                        name: 'title',
                        cell: ({ slug, title}) => this.renderHtml`
                            <a href="/${slug}" target="_top">${title}</a>
                        `
                    }
                ],
            }
        );
    }
};
