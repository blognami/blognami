import test from 'node:test';
import assert from 'node:assert';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { existsSync, unlinkSync } from 'node:fs';

import { Client } from './client.js';

const dbFile = () => join(
    tmpdir(),
    `pinstripe-db-test-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}.db`
);

const cleanupFile = path => { if(existsSync(path)) unlinkSync(path); };

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const raceWithTimeout = (promise, ms) => Promise.race([
    promise.then(() => 'resolved'),
    wait(ms).then(() => 'timeout')
]);

test('withSilence waits for in-flight activity but not connected idle clients', async () => {
    const filename = dbFile();
    const a = Client.new({ adapter: 'sqlite', filename });
    const b = Client.new({ adapter: 'sqlite', filename });

    // both clients run a query, leaving them "connected" but idle (no in-flight activity)
    await a.run('select 1 as x');
    await b.run('select 1 as x');

    // withSilence should NOT wait for b's destroy — b is idle, no in-flight ops
    let fnRan = false;
    await a.withSilence(async () => { fnRan = true; });
    assert.equal(fnRan, true);

    await a.destroy();
    await b.destroy();
    cleanupFile(filename);
});

test('withSilence runs immediately when no other clients are connected', async () => {
    const filename = dbFile();
    const a = Client.new({ adapter: 'sqlite', filename });
    await a.run('select 1 as x');

    let fnRan = false;
    await a.withSilence(async () => { fnRan = true; });
    assert.equal(fnRan, true);

    await a.destroy();
    cleanupFile(filename);
});

test('new run() during fn queues until withSilence returns', async () => {
    const filename = dbFile();
    const a = Client.new({ adapter: 'sqlite', filename });
    const b = Client.new({ adapter: 'sqlite', filename });

    await a.run('create table t (x integer)');

    let releaseFn;
    const fnGate = new Promise(resolve => { releaseFn = resolve; });
    const silencePromise = a.withSilence(async () => { await fnGate; });

    await wait(10);

    let bRunDone = false;
    const bRunPromise = b.run('select 1 as x').then(() => { bRunDone = true; });

    assert.equal(await raceWithTimeout(bRunPromise, 20), 'timeout');
    assert.equal(bRunDone, false);

    releaseFn();
    await silencePromise;
    await bRunPromise;
    assert.equal(bRunDone, true);

    await a.destroy();
    await b.destroy();
    cleanupFile(filename);
});

test('fn throws — gate releases, subsequent queries succeed', async () => {
    const filename = dbFile();
    const a = Client.new({ adapter: 'sqlite', filename });
    await a.run('select 1 as x');

    await assert.rejects(
        a.withSilence(async () => { throw new Error('boom'); }),
        { message: 'boom' }
    );

    const result = await a.run('select 2 as y');
    assert.equal(result[0].y, 2);

    await a.destroy();
    cleanupFile(filename);
});

test('nested withSilence — second waits for first', async () => {
    const filename = dbFile();
    const a = Client.new({ adapter: 'sqlite', filename });

    const order = [];

    let releaseFirst;
    const firstGate = new Promise(resolve => { releaseFirst = resolve; });

    const firstPromise = a.withSilence(async () => {
        order.push('first-start');
        await firstGate;
        order.push('first-end');
    });

    await wait(10);

    const secondPromise = a.withSilence(async () => {
        order.push('second-start');
    });

    await wait(20);
    assert.deepEqual(order, ['first-start']);

    releaseFirst();
    await firstPromise;
    await secondPromise;

    assert.deepEqual(order, ['first-start', 'first-end', 'second-start']);

    cleanupFile(filename);
});

test('drop() (sqlite) — file unlinks, next run reopens', async () => {
    const filename = dbFile();
    const a = Client.new({ adapter: 'sqlite', filename });

    await a.run('create table t (x integer)');
    await a.run('insert into t (x) values (1)');
    assert.ok(existsSync(filename));

    await a.drop();
    assert.ok(!existsSync(filename));

    await a.run('create table t2 (y integer)');
    assert.ok(existsSync(filename));

    await a.destroy();
    cleanupFile(filename);
});

test('withSilence waits for in-flight transaction', async () => {
    const filename = dbFile();
    const a = Client.new({ adapter: 'sqlite', filename });
    const b = Client.new({ adapter: 'sqlite', filename });

    await a.run('create table t (x integer)');

    let releaseTransaction;
    const transactionGate = new Promise(resolve => { releaseTransaction = resolve; });

    const transactionPromise = b.transaction(async () => {
        await b.run('insert into t (x) values (1)');
        await transactionGate;
    });

    await wait(10);

    let fnRan = false;
    const silencePromise = a.withSilence(async () => { fnRan = true; });

    assert.equal(await raceWithTimeout(silencePromise, 20), 'timeout');
    assert.equal(fnRan, false);

    releaseTransaction();
    await transactionPromise;
    await b.destroy();

    await silencePromise;
    assert.equal(fnRan, true);

    await a.destroy();
    cleanupFile(filename);
});

test('withSilence waits for in-flight lock', async () => {
    const filename = dbFile();
    const a = Client.new({ adapter: 'sqlite', filename });
    const b = Client.new({ adapter: 'sqlite', filename });

    await a.run('create table t (x integer)');

    let releaseLock;
    const lockGate = new Promise(resolve => { releaseLock = resolve; });

    const lockPromise = b.lock(async () => {
        await b.run('insert into t (x) values (2)');
        await lockGate;
    });

    await wait(10);

    let fnRan = false;
    const silencePromise = a.withSilence(async () => { fnRan = true; });

    assert.equal(await raceWithTimeout(silencePromise, 20), 'timeout');
    assert.equal(fnRan, false);

    releaseLock();
    await lockPromise;
    await b.destroy();

    await silencePromise;
    assert.equal(fnRan, true);

    await a.destroy();
    cleanupFile(filename);
});

test('lock body queries skip silence gate (no deadlock)', async () => {
    const filename = dbFile();
    const a = Client.new({ adapter: 'sqlite', filename });
    const b = Client.new({ adapter: 'sqlite', filename });

    await a.run('create table t (x integer)');

    let stage = 'idle';
    let releaseLock;
    const lockGate = new Promise(resolve => { releaseLock = resolve; });

    const lockPromise = b.lock(async () => {
        stage = 'lock-q1';
        await b.run('insert into t (x) values (3)');
        await lockGate;
        stage = 'lock-q2';
        await b.run('insert into t (x) values (4)');
        stage = 'lock-done';
    });

    await wait(10);
    assert.equal(stage, 'lock-q1');

    const silencePromise = a.withSilence(async () => {});

    await wait(20);
    assert.equal(stage, 'lock-q1');

    releaseLock();
    await lockPromise;
    assert.equal(stage, 'lock-done');

    await b.destroy();
    await silencePromise;

    await a.destroy();
    cleanupFile(filename);
});
