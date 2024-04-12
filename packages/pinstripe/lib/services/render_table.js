export default {
    create(){
        return (...args) => this.render(...args);
    },

    async render(tableAdaptable, options = {}){
        const tableAdapter = await tableAdaptable.toTableAdapter();

        const { title, rows, pageCount, page } = tableAdapter;

        const columns = extractColumns(tableAdapter, options, this.inflector);

        return this.renderView('_table', {
            title,
            columns,
            rows,
            pageCount,
            page,
        })
    }
};

const extractColumns = (tableAdapter, options, inflector) => {
    const normalizedTableAdapterColumns = normalizeColumns(tableAdapter.columns);
    const normalizedOptionsColumns = options.columns ? normalizeColumns(options.columns) : normalizedTableAdapterColumns;
    
    return normalizedOptionsColumns.map(column => {
        const out = {};
        out.name = column.name;
        out.title = column.title ?? inflector.titleize(column.name);
        out.cell = column.cell || (row => row[column.name]);
        return out;
    });
};

const normalizeColumns = columns => columns.map(column => {
    if(typeof column === 'string') return { name: column };
    return column;
});