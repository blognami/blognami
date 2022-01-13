
export default ({ overload, renderList, renderHtml, params: { _headers = {} } }) => {
    const renderTable = overload({
        ['object, object'](tableAdaptable, options){
            const {
                renderRows = (data) => {
                    const { name, columns, rows } = data;
                    
                    const out = renderHtml`
                        <table class="table">
                            <thead>
                                <tr>
                                    ${columns.map(({ label }) => renderHtml`
                                        <th>${label}</th>
                                    `)}
                                </tr>
                            </thead>
                            <tbody>
                                ${rows.map((row, i) => renderRow({ ...data, row, i }))}
                            </tbody>
                        </table>
                    `;

                    if(_headers['x-pinstripe-frame-type'] != 'overlay') return out;

                    return renderHtml`
                    <div class="modal" data-acts-as="a" data-action="remove" data-ignore-events-from-children="true">
                            <button data-acts-as="a" data-action="remove"></button>
                            <div>
                                <header class="modal-card-head">
                                    <p>${name}</p>
                                </header>
                                <section class="modal-card-body">
                                    ${out}
                                </section>
                                <footer class="modal-card-foot">
                                    <button class="button" data-action="remove">Close</button>
                                </footer>
                            </div>
                        </div>
                    `;
                },

                renderRow = (data) => {
                    const { columns, row } = data;

                    return renderHtml`
                        <tr>
                            ${columns.map(({ name }) => renderHtml`
                                <td>${row[name]}</td>
                            `)}
                        </tr>
                    `;
                },

                ...otherOptions
            } = options;

            return renderList(tableAdaptable, { renderRows, ...otherOptions  });
        },

        object(tableAdaptable){
            return renderTable(tableAdaptable, {});
        }
    })
    return renderTable;
};
