
import mysql from 'mysql';

import { Base } from './base.js';
import { Sql } from './database/sql.js';
import { Table } from './database/table.js';
import { Row } from './database/row.js';
import { Migrator } from './database/migrator.js';

let schemaCache = {};

export const Database = Base.extend().define(dsl => dsl
    .props({
        async initialize(environment){
            this._environment = environment;
            this._config = (await environment.config).database;
            this._transactionLevel = 0;
            this._sessionCache = {};
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
            await fn();
            this._transactionLevel--;
            if(this._transactionLevel == 0){
                await this.run`commit`;
            }
        },

        async cleanUp() {
            if(this._transactionLevel > 0){
                this.run`rollback`;
            }
            this._transactionLevel = 0;
            await new Promise((resolve, reject) => {
                this._connection.end(error => error ? reject(error) : resolve());
            });
        },

        __getMissing(name){
            return Table.create(name, this);
        },

        async _fetchRows(query){
            if(query.match(/^\s*(create|drop|alter)/i)){
                schemaCache = {};
            }

            if(query.match(/^\s*(create|drop|alter|insert|update)/i)){
                this._sessionCache = {};
            }

            const cacheKey = `query:${query}`;

            let rows;
            if(schemaCache[cacheKey] !== undefined){
                rows = schemaCache[cacheKey];
            } else if(this._sessionCache[cacheKey] !== undefined){
                rows = this._sessionCache[cacheKey];
            } else {
                if(this._isInitialized){
                    console.log(`Query: ${query.replace(/\s+/g, ' ').trim()}`);
                }
                rows = await new Promise((resolve, reject) => {
                    this._connection.query(query.toString(), (error, rows) => {
                        if(error){
                            reject(error);
                        } else {
                            if(!Array.isArray(rows)){
                                rows = [rows || {}];
                            }
                            resolve(rows.map(row => ({...row})));
                        }
                    });
                });

                if(query.match(/^\s*(show|describe)/i)){
                    schemaCache[cacheKey] = rows;
                }
                if(query.match(/^\s*(select)/i)){
                    this._sessionCache[cacheKey] = rows;
                }
            }

            return rows.map(row => {
                const { _type, ...fields } = row;
                if(_type !== undefined){
                    return Row.create(_type, this, fields);
                }
                return fields;
            });
        },

        get _connection(){
            if(!this.__connection){
                const { database, ...config } = this._config;
                this.__connection = mysql.createConnection(config);
                this.__connection.connect();
            }
            return this.__connection;
        }

    })
);
