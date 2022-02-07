
import mysql from 'mysql';

import { Base } from './base.js';
import { Sql } from './database/sql.js';
import { Table } from './database/table.js';
import { Union } from './database/union.js';
import { Row } from './database/row.js';
import { Migrator } from './database/migrator.js';

let schemaCache = {};

export const Database = Base.extend().include({
    async initialize({ environment, config }){
        this._environment = environment;
        this._config = await config.database;
        this._sessionCache = {};
        this._transactionLevel = 0;
        this._lockLevel = 0;
        if(await this.exists()){
            await this.run`use ${this}`;
        }
        this._isInitialized = true;
    },

    get sql(){
        return Sql.fromTemplate(this);
    },

    toSql(){
        return Sql.escapeIdentifier(this._config.database);
    },

    async run(...args) {
        return this._fetchRows(
            (await this.sql(...args)).toString()
        );
    },

    async exists(){
        return (
            await this.run`show databases`
        ).map(row => row['Database']).includes(this._config.database);
    },

    async create() {
        if(!(await this.exists())){
            await this.run`create database ${this}`;
            await this.run`use ${this}`;
        }
    },

    async drop() {
        if(await this.exists()){
            await this.run`drop database ${this}`;
        }
    },

    async tables(){
        const out = {}
        if(await this.exists()){
            const rows = await this.run`show tables`;
            rows.forEach(row => {
                const name = Object.values(row)[0];
                out[name] = this.__getMissing(name);
            });
        }
        return out;
    },

    addTable(name){
        return this[name].create();
    },

    removeTable(name){
        return this[name].drop();
    },

    async migrate(...args) {
        await (await new Migrator(this)).migrate(...args);
    },

    async transaction(fn){
        if(this._transactionLevel == 0){
            await this.run`start transaction`;
        }
        this._transactionLevel++;
        const out = await fn();
        this._transactionLevel--;
        if(this._transactionLevel == 0){
            await this.run`commit`;
        }
        return out;
    },

    async lock(fn){
        if(this._lockLevel == 0){
            await this.run`select get_lock('pinstripe_lock', -1)`;
        }
        this._lockLevel++;
        const out = await fn();
        this._lockLevel--;
        if(this._lockLevel == 0){
            await this.run`select release_lock('pinstripe_lock')`;
        }
        return out;
    },

    async destroy() {
        if(this._transactionLevel > 0){
            await this.run`rollback`;
        }
        if(this._lockLevel > 0){
            await this.run`select release_lock('pinstripe_lock')`;
        }
        this._transactionLevel = 0;
        await new Promise((resolve, reject) => {
            this._connection.end(error => error ? reject(error) : resolve());
        });
    },

    async __getMissing(name){
        if(Union.classes[name]){
            return Union.create(name, this);
        }
        if(Row.classes[name]?.isSingleton){
            const table = Row.classes[name].tableClass.new(this);
            return await table.first() || await this.lock(async () => {
                const out = await table.first();
                if(out) return out;
                await table.insert();
                return await table.first();
            });
        }
        return Table.create(name, this);
    },

    async _fetchRows(query){
        return this._mapRows(await new Promise((resolve, reject) => {
            query = query.toString();
            if(query.match(/^\s*(create|drop|alter)/im)){
                schemaCache = {};
            } else if(query.match(/^\s*(create|drop|alter|insert|update)/im)){
                this._sessionCache = {};
            }

            let cache;
            if(query.match(/^\s*(show|describe)/im)){
                cache = schemaCache;
            } else if(query.match(/^\s*select/im)){
                cache = this._sessionCache;
            }
            
            if(cache && cache[query]){
                resolve(cache[query]);
                return;
            }

            if(this._isInitialized){
                let sanitizedQuery = query;
                if(!sanitizedQuery.match(/^select/)){
                    if(sanitizedQuery.length > 1000){
                        sanitizedQuery = `${sanitizedQuery.substr(0, 997)}...`
                    }
                    sanitizedQuery = sanitizedQuery.replace(/[^\x20-\x7E]/g, ' ');
                    sanitizedQuery = sanitizedQuery.replace(/\s+/g, ' ');
                }

                console.log(`Query: ${sanitizedQuery}\n`);
            }

            this._connection.query(query, (error, rows) => {
                if(error){
                    reject(error);
                } else {
                    if(!Array.isArray(rows)){
                        rows = [rows || {}];
                    }

                    if(cache){
                        cache[query] = rows;
                    }

                    resolve(rows);
                }
            });
        }));
    },

    get _connection(){
        if(!this.__connection){
            const { database, ...config } = this._config;
            this.__connection = mysql.createConnection(config);
            this.__connection.connect();
        }
        return this.__connection;
    },

    async _mapRows(rows){
        const out = [];
        rows = [ ...rows ];
        while(rows.length){
            const { _type, ...fields } = rows.shift();
            if(_type !== undefined){
                out.push(await Row.create(_type, this, fields));
            } else {
                out.push(fields);
            }
        }
        return out;
    },

    async __beforeInspect(){
        this._inspectInfo = {
            config: this._config,
            tables: Object.keys(await this.tables()),
            unions: Object.keys(Union.classes)
        };
    },

    __inspect(){
        return `database ${JSON.stringify(this._inspectInfo, null, 2)}`;
    }
});
