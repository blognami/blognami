
export default {
    render(){
        return this.renderHtml`
            <table>
                <thead>
                    <tr>
                        ${this.params.columns.map(column => this.renderHtml`
                            <th>${column.title}</th>
                        `)}
                    </tr>
                </thead>
                <tbody>
                    ${this.params.rows.map(row => this.renderHtml`
                        <tr>
                            ${this.params.columns.map(column => this.renderHtml`
                                <td>${column.cell ? column.cell(row) : row[column.name]}</td>
                            `)}
                        </tr>
                    `)}
                </tbody>
            </table>
        `;
    }
};
