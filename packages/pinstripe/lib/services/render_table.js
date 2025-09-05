export default {
    create(){
        return (...args) => this.render(...args);
    },

    async render(tableAdaptable, options = {}){
        let { title, search } = options;

        const tableAdapter = await tableAdaptable.toTableAdapter({
            q: this.params.q,
            search,
        });

        title ??= tableAdapter.title;

        const { rows, pageCount, page } = tableAdapter;

        const columns = extractColumns(tableAdapter, options, this.inflector);

        return this.renderView('_pinstripe/_table', {
            title,
            search,
            columns,
            rows,
            pageCount,
            page,
            q: this.params.q,
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