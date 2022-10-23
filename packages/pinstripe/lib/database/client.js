import mysql from 'mysql2';
import sqlite from 'sqlite3';
import { existsSync, unlinkSync } from 'fs';

import { Class } from "../class.js";

export const Client = Class.extend().include({
    initialize(){
        this.config = { adapter: 'sqlite' }
        Object.keys(process.env).forEach(name => {
            const matches = name.match(/^DATABASE_(.+)$/);
            if(!matches) return;
            const normalizedName = matches[1].toLowerCase().split(/_+/).map((s, i) => i > 0 ? s[0].toUpperCase() + s.slice(1) : s).join('');
            this.config[normalizedName] = process.env[name];
        });
        
        const { adapter } = this.config
        if(adapter == 'sqlite'){
            this.config = Object.assign({
                filename: `${process.env.NODE_ENV || 'development'}.db`
            }, this.config);
        } else if(adapter == 'mysql'){
            this.config = Object.assign({
                host: 'localhost',
                user: 'root',
                password: '',
            }, this.config);
        }
        
        this.lockLevel = 0;
        this.transactionLevel = 0;
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
                    this.connection = new sqlite.Database(filename);
                }
            });   
        }
        return run.call(this, ...prepare.call(this, query));
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
                await this.connection.destroy();
            },

            async sqlite(){
                await new Promise((resolve, reject) => {
                    this.connection.close(error => error ? reject(error) : resolve());
                });
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
    }
});


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
    console.log(`Query: ${query}`);
    
    return this.adapt(this, {
        mysql(){
            return new Promise((resolve, reject) => {
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
        },

        sqlite(){
            return new Promise((resolve, reject) => {
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
        }
    });
}
