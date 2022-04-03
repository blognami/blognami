
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
                        <div class="ps-modal" data-node-wrapper="anchor" data-action="remove" data-ignore-events-from-children="true">
                            <button data-node-wrapper="anchor" data-action="remove"></button>
                             <div class="ps-card-body">
                                <div class="ps-card-title">
                                    <p>${name}</p>
                                </div>
                                <div class="ps-card-body">
                                    ${out}
                                </div>
                                <div class="ps-card-footer">
                                    <button class="button" data-action="remove">Close</button>
                                </div>
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
