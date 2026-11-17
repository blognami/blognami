import test from 'node:test';
import assert from 'node:assert';

import { Client } from './client.js';
import { expectedBindings } from '../test/expected_bindings.js';

// Records what sqlite3 does, as the expectation the durableObject adapter is held to.

test('a caught inner throw keeps neither row', async () => {
    const client = Client.new({ adapter: 'sqlite', filename: ':memory:' });
    try {
        await client.run('create table rows (name)');

        await client.transaction(async () => {
            await client.run(['insert into rows (name) values (?)', 'outer']);
            try {
                await client.transaction(async () => {
                    await client.run(['insert into rows (name) values (?)', 'inner']);
                    throw new Error('inner');
                });
            } catch {}
            // On sqlite the inner throw has already rolled back and transactionLevel is left
            // at -1 once the outer callback returns; rows written here, after the catch, run
            // outside any transaction and are kept. On durableObject they are rolled back
            // with the rest.
        });

        assert.deepEqual(await client.run('select name from rows'), []);
    } finally {
        await client.destroy();
    }
});

test('booleans, dates and blobs are bound as expected_bindings.js lists', async () => {
    const client = Client.new({ adapter: 'sqlite', filename: ':memory:' });
    try {
        await client.run('create table bindings (name, value)');

        for(const { name, value } of expectedBindings){
            await client.run(['insert into bindings (name, value) values (?, ?)', name, value]);
        }

        const rows = await client.run('select name, typeof(value) as type, value from bindings order by rowid');

        assert.deepEqual(
            rows.map(({ name, type, value }) => ({ name, type, stored: type == 'blob' ? [...value] : value })),
            expectedBindings.map(({ name, type, stored }) => ({ name, type, stored }))
        );
    } finally {
        await client.destroy();
    }
});
