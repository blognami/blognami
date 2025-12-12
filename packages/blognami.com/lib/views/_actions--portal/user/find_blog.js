
export default {
    async render(){
        const { email } =  await this.session.user;

        return this.renderTable(
            this.database.withoutTenantScope.tenants.where({ users: { email, role: 'admin' } }).sites.orderBy('title').paginate(this.params.page),
            {
                title: 'Blogs',
                search: ['title'],
                columns: [
                    {
                        name: 'title',
                        cell: ({ tenantId, title }) => this.renderHtml`
                            <a href="/_actions/user/go_to_blog?id=${tenantId}" target="_top" data-component="ignore">${title}</a>
                        `
                    }
                ],
            }
        );
    }
};
