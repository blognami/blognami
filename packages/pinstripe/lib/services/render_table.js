export default {
    create(){
        return (...args) => this.render(...args);
    },

    async render(tableAdaptable, options = {}){
        const tableAdapter = await tableAdaptable.toTableAdapter();

        const { title, rows, pageCount, page } = tableAdapter;

        const columns = extractColumns(tableAdapter, options);

        return this.renderView('_table', {
            title,
            columns,
            rows,
            pageCount,
            page,
        })
    }
};

const extractColumns = (tableAdapter, options) => {
    const normalizedTableAdapterColumns = normalizeColumns(tableAdapter.columns);
    const normalizedOptionsColumns = options.columns ? normalizeColumns(options.columns) : normalizedTableAdapterColumns;
    
    return normalizedOptionsColumns.map(column => {
        const out = {};
        if(column.name) out.name = column.name;
        if(column.title) out.title = column.title;
        return out;
    });
};

const normalizeColumns = columns => columns.map(column => {
    if(typeof column === 'string') return { name: column, title: column };
    return column;
});