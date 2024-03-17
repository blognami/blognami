export default {
    create(){
        return (...args) => this.render(...args);
    },

    async render(tableAdaptable, options = {}){
        const tableAdapter = await tableAdaptable.toTableAdapter();

        const columns = [
            { name: 'foo', title: 'Foo' },
            { name: 'bar', title: 'Bar' },
            { name: 'baz', title: 'Baz' },
            { name: 'buttons', title: '', cell: (row) => this.renderHtml`
                <a>Edit</a>
            `}
        ];

        const rows = [
            { foo: 'a', bar: 'b', baz: 'c' },
            { foo: 'd', bar: 'e', baz: 'f' },
            { foo: 'g', bar: 'h', baz: 'i' }
        ];

        return this.renderView('_table', {
            columns,
            rows
        })
    }
};