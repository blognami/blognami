
import { Class } from './class.js';
import { Table, Union, Row, Migrator } from './database/index.js';
import { trapify } from './trapify.js';

let loadSchemaPromise;

export const Database = Class.extend().include({

    meta(){
        this.assignProps({ name: 'database' });
    },

    async initialize(client, options = {}){
        this.client = client;
        this.options = options;
        if(!loadSchemaPromise) loadSchemaPromise = Row.loadSchema(client);
        await loadSchemaPromise;
        return trapify(this);
    },

    table(name, fn){
        const out = Table.create(name, this);
        if(fn) return fn.call(out, out);
        return out;
    },

    union(name){
        return Union.create(name, this);
    },

    async singleton(name){
        const { abstract, singleton, collectionName } = Row.for(name);
        if(!singleton || abstract) return;
        const table = this.table(collectionName);
        const out = await table.first();
        if(out) return out;
        return this.lock(async () => {
            const out = await table.first();
            if(out) return out;
            await table.insert();
            return table.first();
        });
    },

    async run(query){
        return mapRows.call(this, await this.client.run(query));
    },

    async reset(){
        await this.destroy();
        loadSchemaPromise = Row.loadSchema(this.client);
        await loadSchemaPromise;
    },

    async destroy(){
        await this.client.destroy();
    },

    lock(fn){
        return this.client.lock(fn);
    },

    transaction(fn){
        return this.client.transaction(fn);
    },

    async migrate(){
        await Migrator.new(this).migrate();
    },

    async drop(){
        await this.client.drop();
        loadSchemaPromise = undefined;
    },

    getUnixTimestamp(){
        return this.client.adapt(this, {
            async mysql(){
                return Object.values((await this.run(`select unix_timestamp()`)).pop()).pop();
            },

            async sqlite(){
                return parseInt(Object.values((await this.run(`select strftime('%s', 'now')`)).pop()).pop());
            }
        });
    },
    
    get info(){
        const out = {};
        Table.names.forEach(name => {
            out[name] = 'table';
        });
        Row.names.sort().forEach(name => {
            const { abstract, singleton, collectionName } = Row.for(name);
            if(abstract){
                out[collectionName] = 'union';
            } else if(singleton) {
                out[collectionName] = 'table';
                out[name] = 'singleton';
            } else {
                out[collectionName] = 'table';
            }
        });
        return out;
    },

    __getMissing(target, name){
        const type = this.info[name];
        if(type == 'union')  return this.union(name);
        if(type == 'singleton') return this.singleton(name);
        if(type == 'table') return this.table(name);
    },

    __inspect(){
        return `database ${JSON.stringify(this.info, null, 2)}`;
    }
});

function mapRows(rows){
    const out = [];
    for(let i = 0; i < rows.length; i++){
        const { _type, ...fields } = rows[i];
        if(_type){
            out.push(Row.create(_type, this, fields, true));
        } else {
            out.push(rows[i]);
        }
    }
    return out;
}

