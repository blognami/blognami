// What sqlite3 stores for each value bound through client.run, as observed by
// lib/client.sqlite_behaviour.test.js; the durableObject adapter is held to the same table.
// `type` is typeof(column) in a column with no declared type; a blob's `stored` is its bytes.
export const expectedBindings = [
    { name: 'true', value: true, type: 'integer', stored: 1 },
    { name: 'false', value: false, type: 'integer', stored: 0 },
    { name: 'date', value: new Date(1700000000000), type: 'real', stored: 1700000000000 },
    { name: 'blob', value: new Uint8Array([0, 1, 2, 255]), type: 'blob', stored: [0, 1, 2, 255] }
];
