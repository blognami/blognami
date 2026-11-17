import { DurableObject } from 'cloudflare:workers';
import { Client } from '../../../lib/client.js';
import { expectedBindings } from '../../expected_bindings.js';

const TIMER_MS = 20;

const timer = () => new Promise(resolve => setTimeout(resolve, TIMER_MS));

const insert = (client, name) => client.run(['insert into rows (name) values (?)', name]);

const rows = async client => (await client.run('select name from rows order by rowid')).map(({ name }) => name);

// Every table in the object's storage, the runtime's own included; `sqlite_schema` is never cached.
const tableNames = async client => (await client.run(`select name from sqlite_schema where type = 'table'`)).map(({ name }) => name);

const writeTwice = async (client, method, throws) => {
    await client.run('create table rows (name)');
    const out = {};
    try {
        out.value = await client[method](async () => {
            await insert(client, 'before timer');
            await timer();
            await insert(client, 'after timer');
            if(throws) throw new Error('callback threw');
            return 'callback returned';
        });
    } catch(e){
        out.error = e.message;
    }
    out.rows = await rows(client);
    return out;
};

// Each case runs the real `Client` on this object's storage and returns what it saw.
const cases = {
    async selectOne(client){
        return client.run('select 1 as one');
    },

    transactionThrows: client => writeTwice(client, 'transaction', true),

    transactionReturns: client => writeTwice(client, 'transaction', false),

    lockThrows: client => writeTwice(client, 'lock', true),

    lockReturns: client => writeTwice(client, 'lock', false),

    async innerReturnsOuterThrows(client){
        await client.run('create table rows (name)');
        const out = {};
        try {
            await client.transaction(async () => {
                await client.transaction(() => insert(client, 'inner'));
                throw new Error('outer threw');
            });
        } catch(e){
            out.error = e.message;
        }
        out.rows = await rows(client);
        return out;
    },

    async caughtInnerThrow(client){
        await client.run('create table rows (name)');
        const value = await client.transaction(async () => {
            await insert(client, 'outer');
            try {
                await client.transaction(async () => {
                    await insert(client, 'inner');
                    throw new Error('inner threw');
                });
            } catch {}
            // The one recorded difference from sqlite: a row written here, after the catch, is
            // rolled back with the rest; on sqlite it runs outside any transaction and is kept.
            await insert(client, 'after catch');
            return 'callback returned';
        });
        return { value, rows: await rows(client), transactionLevel: client.transactionLevel };
    },

    async twoClients(client){
        const events = [];
        const run = (client, name) => client.transaction(async () => {
            events.push(`${name} start`);
            await timer();
            events.push(`${name} end`);
        });
        await Promise.all([ run(client, 'a'), run(Client.new(client.config), 'b') ]);
        return events;
    },

    async insertRow(client){
        await client.run('create table if not exists rows (name)');
        await insert(client, 'row');
        return rows(client);
    },

    async bindings(client){
        await client.run('create table bindings (name, value)');
        for(const { name, value } of expectedBindings){
            await client.run(['insert into bindings (name, value) values (?, ?)', name, value]);
        }
        const rows = await client.run('select name, typeof(value) as type, value from bindings order by rowid');
        return rows.map(({ name, type, value }) => {
            if(type != 'blob') return { name, type, stored: value };
            return { name, type, stored: value instanceof Uint8Array ? [...value] : 'not a Uint8Array' };
        });
    },

    async schema(client){
        await client.run('create table rows (name)');
        return { tableNames: await tableNames(client), schema: Object.keys(await client.extractSchema()) };
    },

    async drop(client){
        await client.run('create table rows (name)');
        await insert(client, 'row');
        await client.drop();
        return { tableNames: await tableNames(client), rows: await client.run('select 1 as one') };
    }
};

export class Fixture extends DurableObject {
    async fetch(request){
        const name = new URL(request.url).searchParams.get('case');
        const client = Client.new({ adapter: 'durableObject', storage: this.ctx.storage });
        try {
            return Response.json({ result: await cases[name](client) });
        } catch(e){
            return Response.json({ error: e.message });
        }
    }
}

export default {
    async fetch(request, env){
        // No `object`: the test's readiness probe, which loads no object.
        const object = new URL(request.url).searchParams.get('object');
        if(!object) return new Response('ready');
        return env.FIXTURE.get(env.FIXTURE.idFromName(object)).fetch(request);
    }
};
