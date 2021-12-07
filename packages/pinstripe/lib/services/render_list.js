
export default ({ overload, renderHtml }) => {
    const renderList = overload({
        async ['object, object'](tableAdaptable, options){
            const tableAdapter = await tableAdaptable.toTableAdapter();
            const {
                renderRows = (data) => {
                    return data.rows.map((row, i) => renderRow({ ...data, row, i }));
                },

                renderRow = ({ row }) => {
                    return renderHtml`
                        <pre>${JSON.stringify(row, null, 2)}</pre>
                    `
                },
                
                renderNoRows = ({ name }) => {
                    return renderHtml`
                        <p>There are currently no ${name}.</p>
                    `;
                },
                
                renderPagination = ({ pageCount, page }) => {
                    const pagination = new Array(pageCount).fill().map((_,i) => {
                        const number = i + 1;
                        const current = number == page;
                        return { number, current };
                    });
                    if(pagination.length > 1) return renderHtml` 
                        <nav class="pagination">
                            <ul class="pagination-list mb-4">
                                ${pagination.map(({ number, current }) => renderHtml`
                                    <li>
                                        <a class="pagination-link${current ? ' is-current' : ''}" href="?page=${number}">${number}</a>
                                    </li>
                                `)}
                            </ul>
                        </nav>
                    `;
                }
            } = options;

            return renderHtml`
                ${ tableAdapter.rowCount > 0 ? renderRows(tableAdapter) : renderNoRows(tableAdapter) }
                ${ renderPagination(tableAdapter) }
            `;
        },

        ['object, function'](tableAdaptable, renderRow){
            return renderList(tableAdaptable, { renderRow })
        },

        object(tableAdaptable){
            return renderList(tableAdaptable, {});
        }
    });
    return renderList;
};
