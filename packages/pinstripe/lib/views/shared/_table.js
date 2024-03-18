

export const styles = `
    .root {
        width: 100%;
        border-collapse: collapse;
    }

    .heading-cell, .data-cell {
        padding: 0.8rem;
        border: 0.1rem solid #dbdbdb;
    }

    .pagination {
        text-align: right;
        margin-top: 7px;
    }
`;

export default {
    render(){
        return this.renderHtml`
            <pinstripe-modal>
                ${this.renderView('_panel', {
                    title: this.params.title,
                    body: this.renderHtml`
                        <table class="${this.cssClasses.root}">
                            <thead>
                                <tr>
                                    ${this.params.columns.map(column => this.renderHtml`
                                        <th class="${this.cssClasses.headingCell}">${column.title}</th>
                                    `)}
                                </tr>
                            </thead>
                            <tbody>
                                ${this.params.rows.map(row => this.renderHtml`
                                    <tr>
                                        ${this.params.columns.map(column => this.renderHtml`
                                            <td class="${this.cssClasses.dataCell}">${column.cell ? column.cell(row) : row[column.name]}</td>
                                        `)}
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                        ${() => {
                            if(this.params.pageCount > 1) return this.renderHtml`
                                <div class="${this.cssClasses.pagination}">
                                    ${this.renderView('_pagination', {
                                        pageCount: this.params.pageCount,
                                        page: this.params.page,
                                    })}
                                </div>
                            `;
                        }}
                    `,
                    footer: this.renderView('_button', {
                        body: this.renderHtml`
                            Close
                            <script type="pinstripe">
                                this.parent.on('click', () => this.trigger('close'));
                            </script>
                        `,
                    })
                })}
            </pinstripe-modal>
        `;
    }
};
