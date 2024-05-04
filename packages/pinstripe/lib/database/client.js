import mysql from 'mysql2';
import sqlite from 'sqlite3';
import { existsSync, unlinkSync } from 'fs';

import { Class } from '../class.js';

import { MYSQL_COLUMN_TYPE_TO_TYPE_MAP, SQLITE_COLUMN_TYPE_TO_TYPE_MAP } from './constants.js';

let sqliteConnectionCounters = {};
let sqliteConnections = {};

export const Client = Class.extend().include({
    initialize(config){
        this.config = config;
        this.lockLevel = 0;
        this.transactionLevel = 0;
        this.cache = {};
    },

    async run(query){
        if(!this.connection){
            await this.adapt(this, {
                async mysql(){
                    const { adapter, database, ...connectionConfig } = this.config;
                    this.connection = mysql.createConnection(connectionConfig);
                    this.connection.connect();
                    const databases = (await this.run('show databases')).map(row => row['Database']);
                    if(!databases.includes(database)){
                        await this.run(`create database ${database}`);
                    }
                    await this.run(`use ${database}`);
                },

                sqlite(){
                    const { filename } = this.config;
                    if(sqliteConnectionCounters[filename]){
                        sqliteConnectionCounters[filename]++;
                    } else {
                        sqliteConnectionCounters[filename] = 1;
                        sqliteConnections[filename] = new sqlite.Database(filename);
                    }
                    this.connection = sqliteConnections[filename];
                }
            });   
        }
        return run.call(this, ...prepare.call(this, await resolveQuery(query)));
    },

    async lock(fn){
        let out;
        await this.adapt(this, {
            async mysql(){
                if(this.lockLevel == 0){
                    await this.run(`select get_lock('pinstripe_lock', -1)`);
                }
                this.lockLevel++;
                try {
                    out = await fn();
                } catch(e){
                    this.lockLevel = 0;
                    await this.run(`select release_lock('pinstripe_lock')`);
                    throw e;
                }
                this.lockLevel--;
                if(this.lockLevel == 0){
                    await this.run(`select release_lock('pinstripe_lock')`);
                }
            },

            sqlite(){
                out = this.transaction(fn);
            }
        });
        return out;
    },

    async transaction(fn){
        let out;
        if(this.transactionLevel == 0){
            await this.adapt(this, {
                async mysql(){
                    await this.run('start transaction');
                },

                async sqlite(){
                    await this.run('pragma locking_mode = exclusive');
                    await this.run('begin exclusive transaction');
                }
            });
        }
        this.transactionLevel++;
        try {
            out = await fn();
        } catch(e){
            if(this.transactionLevel > 0) await this.run('rollback');
            this.transactionLevel = 0;
            throw e;
        }
        this.transactionLevel--;
        if(this.transactionLevel == 0){
            await this.run('commit');
        }
        return out;
    },

    async drop(){
        await this.adapt(this, {
            async mysql(){
                await this.run(`drop database ${this.config.database}`);
            },

            sqlite(){
                if(!existsSync(this.config.filename)) return;
                unlinkSync(this.config.filename);
            }
        });
        await this.destroy();
    },

    async destroy(){
        if(this.connection) await this.adapt(this, {
            async mysql(){
                await this.connection.end();
            },

            async sqlite(){
                const { filename } = this.config;

                sqliteConnectionCounters[filename]--;
                if(sqliteConnectionCounters[filename] == 0){
                    await new Promise((resolve, reject) => {
                        this.connection.close(error => error ? reject(error) : resolve());
                    });
                    delete sqliteConnections[filename];
                    delete sqliteConnectionCounters[filename];
                }
            }
        })
        delete this.connection;
    },

    adapt(...args){
        const[ alternatives, that ] = args.reverse();
        const { adapter } = this.config;
        const fn = alternatives[adapter];
        if(!fn) throw new Error(`"${adapter}" adapter not supported.`);
        return fn.call(that);
    },

    async extractSchema(){
        const out = {};

        const tableNames = await this.adapt(this, {
            async mysql(){
                const rows = await this.run('show tables');
                return rows.map(row => Object.values(row)[0]);
            },

            async sqlite(){
                const rows = await this.run(`select name from sqlite_schema where type ='table' and name not like 'sqlite_%'`);
                return rows.map(({ name }) => name);
            }
        });
    
        while(tableNames.length){
            const tableName = tableNames.shift();
            const columns = await this.adapt(this, {
                async mysql(){
                    const out = {};
                    const rows = await this.run(`describe \`${tableName}\``);
                    rows.forEach(row => {
                        const name = row['Field'];
                        let type;
                        if(name == '_id'){
                            type = 'primary_key';
                        } else if(name == 'id'){
                            type = 'alternate_key';
                        } else {
                            type = MYSQL_COLUMN_TYPE_TO_TYPE_MAP[row['Type']] || 'string';
                        }
                        
                        out[name] = type;
                    });
                    return out;
                },

                async sqlite(){
                    const out = {};
                    const rows = await this.run(`pragma table_info(\`${tableName}\`)`);
                    rows.forEach(row => {
                        const { name } = row;
                        let type;
                        if(name == '_id'){
                            type = 'primary_key';
                        } else if(name == 'id'){
                            type = 'alternate_key';
                        } else if(name.match(/.+Id$/)){
                            type = 'foreign_key';
                        } else {
                            type = SQLITE_COLUMN_TYPE_TO_TYPE_MAP[row.type] || 'string';
                        }
                        out[name] = type;
                    });
                    return out;
                }
            });
            out[tableName] = columns;
        }

        return out;
    }
});


async function resolveQuery(query){
    let out = await query;
    if(Array.isArray(out)){
        out = [ ...out ];
        for(let i = 0; i < out.length; i++){
            out[i] = await resolveQuery(out[i]);
        }
    }
    return out;
}

function flattenFirst(query){
    if(!Array.isArray(query[0])) return query;
    return flattenFirst([...query[0], ...query.slice(1)]);
}

function prepare(query){
    const preparedQuery = [];
    const values = [];
    let normalizedQuery = query;
    if(!Array.isArray(normalizedQuery)) normalizedQuery = [ normalizedQuery ];
    normalizedQuery = [ ...normalizedQuery ];
    while(normalizedQuery.length){
        normalizedQuery = flattenFirst(normalizedQuery);
        preparedQuery.push(normalizedQuery.shift().replace(/\?/g, () => {
            let value = normalizedQuery.shift();
            if(typeof value?.toSql == 'function') return value.toSql();
            return this.adapt({
                mysql(){
                    if(typeof value == 'boolean') return `'${value}'`;
                    return mysql.escape(value);
                },

                sqlite(){
                    values.push(value);
                    return '?';
                }
            });
        }));
    }
    return [ preparedQuery.join(''), values ];
}

function run(query, values){
    const cacheKey = JSON.stringify([query, values]);

    const isTest = process.env.NODE_ENV == 'test';
    
    return this.adapt(this, {
        async mysql(){
            if(query.match(/^\s*(create|drop|alter|insert|update|delete)/im)){
                this.cache = {};
            }
            
            const cache = query.match(/^\s*select/im) ? this.cache : undefined;

            if(cache && cache[cacheKey]) return [...cache[cacheKey]];

            if(!isTest) console.log(`Query: ${query}`);
            
            const out = await new Promise((resolve, reject) => {
                this.connection.query(query, (error, rows) => {
                    if(error){
                        reject(error);
                    } else {
                        if(!Array.isArray(rows)){
                            rows = [rows || {}];
                        }
                        resolve(rows);
                    }
                });
            });

            if(cache) cache[cacheKey] = out;

            return  [...out];
        },

        async sqlite(){
            if(query.match(/^\s*(create|drop|alter|insert|update|delete)/im)){
                this.cache = {};
            }

            const cache = query.match(/^\s*select/im) && !query.match(/^\s*(select\s+([\s\S]+?)\s+from\s+sqlite_schema|pragma)/im) ? this.cache : undefined;

            if(cache && cache[cacheKey]) return [...cache[cacheKey]];

            if(!isTest) console.log(`Query: ${query}`);

            const out = await new Promise((resolve, reject) => {
                this.connection.all(query, ...values, (error, rows) => {
                    if(error){
                        reject(error);
                    } else {
                        if(!Array.isArray(rows)){
                            rows = [rows || {}];
                        }
                        resolve(rows);
                    }
                });
            });
        
            if(cache) cache[cacheKey] = out;

            return  [...out];
        }
    });
}
