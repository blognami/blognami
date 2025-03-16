
export default {
    async render(){
        return this.renderTable(
            this.database.revisions.where({ revisableId: this.params.revisableId, name: this.params.name }).orderBy('createdAt', 'desc').paginate(this.params.page),
            {
                columns: [
                    {
                        name: 'createdAt',
                        cell: row => this.renderHtml`
                            ${this.formatDate(row.createdAt, 'LLL dd, yyyy TT')}
                        `
                    },
                    {
                        name: 'by',
                        cell: row => this.renderHtml`
                            ${async () => {
                                const user = await this.database.users.where({ id: row.userId }).first();
                                if(!user) return 'Unknown';
                                return user.name;
                            }}
                        `
                    },
                    { 
                        name: 'actions',
                        title: '',
                        cell: row => this.renderView('_button', {
                            tagName: 'a',
                            body: 'Restore',
                            isPrimary: true,
                            size: 'small',
                            href: `/_actions/admin/restore_revisable_field?id=${row.id}`,
                            target: '_overlay',
                            'data-test-id': 'restore'
                        })
                    }
                ],
            }
        );
    }
};
