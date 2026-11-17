import test from 'node:test';
import assert from 'node:assert';
import { execFileSync } from 'node:child_process';

const script = `
    import { createRequire } from 'node:module';
    import { Client } from ${JSON.stringify(new URL('./client.js', import.meta.url).href)};

    const client = Client.new({ adapter: 'sqlite', filename: ':memory:' });
    const rows = await client.run('select 1 as one');
    await client.destroy();

    // Both drivers are CommonJS, so a loaded one is in the require cache.
    const loaded = Object.keys(createRequire(import.meta.url).cache);
    const isLoaded = name => loaded.some(path => path.includes('/node_modules/' + name + '/'));

    console.log(JSON.stringify({ rows, sqlite3: isLoaded('sqlite3'), mysql2: isLoaded('mysql2') }));
`;

test('a sqlite client does not load mysql2', () => {
    const out = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
        env: { ...process.env, NODE_ENV: 'test' },
        encoding: 'utf8'
    });

    assert.deepEqual(JSON.parse(out), { rows: [{ one: 1 }], sqlite3: true, mysql2: false });
});
