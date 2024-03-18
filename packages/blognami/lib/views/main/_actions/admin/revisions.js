
export default {
    async render(){
        return this.renderTable(
            this.database.revisions.where({ revisableId: this.params.revisableId }).orderBy('createdAt', 'desc').paginate(this.params.page, 2),
            {
                columns: ['createdAt', { 
                    name: 'actions',
                    title: '',
                    cell: row => this.renderHtml`
                        <a href="/_actions/admin/restore_revisable_field?id=${row.id}">Restore</a>
                    `
                }],
            }
        );
    }
};
