import test, { before, after } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

import { expectedBindings } from '../test/expected_bindings.js';

const READY_TIMEOUT_MS = 60000;
const READY_POLL_MS = 250;
const KILL_GRACE_MS = 5000;

const require = createRequire(import.meta.url);
const fixture = fileURLToPath(new URL('../test/durable_object', import.meta.url));

let wrangler;
let origin;
let stateDir;
let output = '';

const freePort = () => new Promise((resolve, reject) => {
    const server = createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
        const { port } = server.address();
        server.close(() => resolve(port));
    });
});

const runCase = async name => {
    const response = await fetch(`${origin}/?object=${randomUUID()}&case=${name}`);
    const { result, error } = await response.json();
    if(error) throw new Error(error);
    return result;
};

before(async () => {
    const port = await freePort();
    const inspectorPort = await freePort();
    origin = `http://127.0.0.1:${port}`;
    stateDir = mkdtempSync(join(tmpdir(), 'blognami-durable-object-'));

    // Not `npx`, which runs a workspace's bin from the package root, away from the fixture.
    wrangler = spawn(process.execPath, [
        join(dirname(require.resolve('wrangler/package.json')), 'bin', 'wrangler.js'), 'dev',
        '--ip', '127.0.0.1',
        '--port', `${port}`,
        '--inspector-port', `${inspectorPort}`,
        '--persist-to', stateDir
    ], {
        cwd: fixture,
        env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: true
    });
    wrangler.stdout.on('data', data => { output += data; });
    wrangler.stderr.on('data', data => { output += data; });

    const deadline = Date.now() + READY_TIMEOUT_MS;
    while(true){
        if(wrangler.exitCode !== null) throw new Error(`wrangler dev exited with ${wrangler.exitCode}:\n${output}`);
        try {
            if((await fetch(origin)).ok) break;
        } catch {}
        if(Date.now() > deadline) throw new Error(`wrangler dev did not answer:\n${output}`);
        await new Promise(resolve => setTimeout(resolve, READY_POLL_MS));
    }
});

after(async () => {
    if(wrangler && wrangler.exitCode === null){
        const exited = new Promise(resolve => wrangler.once('exit', resolve));
        // The whole process group: `wrangler dev` runs `workerd` as a child.
        try { process.kill(-wrangler.pid, 'SIGTERM'); } catch {}
        const timer = setTimeout(() => { try { process.kill(-wrangler.pid, 'SIGKILL'); } catch {} }, KILL_GRACE_MS);
        await exited;
        clearTimeout(timer);
    }
    if(stateDir) rmSync(stateDir, { recursive: true, force: true });
    // `wrangler dev` keeps its build output in `.wrangler` beside the config.
    rmSync(join(fixture, '.wrangler'), { recursive: true, force: true });
});

test('select 1 as one runs on the durableObject adapter', async () => {
    assert.deepEqual(await runCase('selectOne'), [{ one: 1 }]);
});

for(const method of ['transaction', 'lock']){
    test(`${method}(fn) keeps both rows when fn returns and neither when it throws`, async () => {
        assert.deepEqual(await runCase(`${method}Throws`), { error: 'callback threw', rows: [] });
        assert.deepEqual(await runCase(`${method}Returns`), { value: 'callback returned', rows: ['before timer', 'after timer'] });
    });
}

test('a nested transaction(fn) joins the outer one', async () => {
    assert.deepEqual(await runCase('innerReturnsOuterThrows'), { error: 'outer threw', rows: [] });
});

test('a caught inner throw keeps no row', async () => {
    assert.deepEqual(await runCase('caughtInnerThrow'), { value: 'callback returned', rows: [], transactionLevel: 0 });
});

test('two clients on one object run their transactions one after the other', async () => {
    assert.deepEqual(await runCase('twoClients'), ['a start', 'a end', 'b start', 'b end']);
});

test('a second object does not see the first object\'s rows', async () => {
    // Each call is a fresh object: the second creates the table anew and reads one row, not two.
    assert.deepEqual(await runCase('insertRow'), ['row']);
    assert.deepEqual(await runCase('insertRow'), ['row']);
});

test('booleans, dates and blobs are bound as expected_bindings.js lists', async () => {
    assert.deepEqual(
        await runCase('bindings'),
        expectedBindings.map(({ name, type, stored }) => ({ name, type, stored }))
    );
});

test('extractSchema leaves out the runtime\'s tables and returns the client\'s', async () => {
    const { tableNames, schema } = await runCase('schema');
    // Local workerd keeps this table in every object, so the exclusion is exercised.
    assert.ok(tableNames.includes('__miniflare_do_name'));
    assert.deepEqual(schema.sort(), ['columnTypes', 'rows']);
});

test('drop() removes the client\'s tables and a query still runs', async () => {
    const { tableNames, rows } = await runCase('drop');
    assert.ok(!tableNames.includes('rows'));
    assert.deepEqual(rows, [{ one: 1 }]);
});
