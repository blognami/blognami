import test from 'node:test';
import assert from 'node:assert';

import renderTable from './render_table.js';

const tableAdaptable = {
    toTableAdapter: async () => ({ title: 'Blogs', columns: [{ name: 'title' }], rows: [], page: 1, pageCount: 1 })
};

const contextFor = params => ({
    params,
    inflector: { titleize: value => value },
    renderView: (name, viewParams) => ({ name, viewParams }),
});

const scopeOptions = [{ value: 'mine', label: 'Mine' }, { value: 'all', label: 'All' }];

test("renderTable - a filter takes its value from params", async () => {
    const { name, viewParams } = await renderTable.render.call(contextFor({ scope: 'all' }), tableAdaptable, {
        filters: [{ name: 'scope', options: scopeOptions }]
    });
    assert.equal(name, '_blognami/_table');
    assert.deepEqual(viewParams.filters, [{ name: 'scope', options: scopeOptions, value: 'all' }]);
});

test("renderTable - a filter defaults to its first option", async () => {
    const { name, viewParams } = await renderTable.render.call(contextFor({}), tableAdaptable, {
        filters: [{ name: 'scope', options: scopeOptions }]
    });
    assert.equal(name, '_blognami/_table');
    assert.deepEqual(viewParams.filters, [{ name: 'scope', options: scopeOptions, value: 'mine' }]);
});

test("renderTable - no filters option yields an empty list", async () => {
    const { name, viewParams } = await renderTable.render.call(contextFor({}), tableAdaptable, {});
    assert.equal(name, '_blognami/_table');
    assert.deepEqual(viewParams.filters, []);
});
