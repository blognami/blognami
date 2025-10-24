
export default {
    async render(){
        return this.renderTable(
            this.database.users.orderBy('name').paginate(this.params.page),
            {
                search: ['name', 'email'],
                columns: [
                    {
                        name: 'name',
                        cell: ({ slug, name}) => this.renderHtml`
                            <a href="/${slug}" data-target="_top">${name}</a>
                        `
                    },
                    {
                        name: 'email',
                        cell: ({ slug, email}) => this.renderHtml`
                            <a href="/${slug}" data-target="_top">${email}</a>
                        `
                    }
                ],
            }
        );
    }
};
