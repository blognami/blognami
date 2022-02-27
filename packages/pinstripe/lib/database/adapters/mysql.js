import mysql from 'mysql2';
import * as crypto from 'crypto';

import { Adapter } from '../adapter.js';
import { Sql } from '../sql.js';
import {
    TYPE_TO_DEFAULT_VALUE_MAP,
} from '../constants.js';
import { Inflector } from '../../inflector.js';
import { Column } from '../column.js';
import { Union, extractTables } from '../union.js';
import { Table } from '../table.js';
import { Row } from '../row.js';

let schemaCache = {};

Adapter.register('mysql').include({
    get connection(){
        if(!this._connection){
            const { database, ...connectionConfig } = this.config;
            this._connection = mysql.createConnection(connectionConfig);
            this._connection.connect();
        }
        return this._connection;
    },
    
    escapeValue(value){
        return Sql.escapeValue(value);
    },

    escapeIdentifier(identifier){
        return Sql.fromString(`\`${('' + identifier).replace(/`/g, '')}\``);
    },

    methods: {
        database: {
            renderSql(...args){
                return Sql.createRenderer([ this ])(...args);
            },

            toSql(){
                return this._adapter.escapeIdentifier(this._adapter.config.database);
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
                    this._adapter.connection.end(error => error ? reject(error) : resolve());
                });
            },

            async _fetchRows(sql){

                return this._mapRows(await new Promise((resolve, reject) => {
                    const query = buildQuery(sql);
                    if(query.match(/^\s*(create|drop|alter)/im)){
                        schemaCache = {};
                    }
                    if(query.match(/^\s*(create|drop|alter|insert|update|delete)/im)){
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
        
                    const isDevelopmentEnvironment = (process.env.NODE_ENV || 'development') == 'development';
        
                    if(isDevelopmentEnvironment && this._isInitialized){
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
        
                    this._adapter.connection.query(query, (error, rows) => {
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
            
            async _useIfExists(){
                if(await this.exists()){
                    await this.run`use ${this}`;
                }
            }
        },

        column: {
            renderSql(...args){
                return Sql.createRenderer([ this ])(...args);
            },

            toSql(){
                return this.renderSql`${this._table}.${this._adapter.escapeIdentifier(this._name)}`;
            },

            async create(type = 'string', options = {}){
                options = {
                    index: type == 'foreign_key',
                    default: TYPE_TO_DEFAULT_VALUE_MAP[type],
                    ...options
                };
                const table = this._table;
                const database = table._database;
        
                await table.create();
        
                if(!await this.exists()){
                    await database.run`
                        alter table ${this._adapter.escapeIdentifier(table.constructor.name)}
                        add column ${this._adapter.escapeIdentifier(this._name)} ${Sql.fromString(TYPE_TO_COLUMN_TYPE_MAP[type])}
                        ${options.default !== undefined ? this.renderSql`default ${options.default}` : undefined}
                    `;
                }
        
                if(options.index){
                    await database.run`
                        alter table ${this._adapter.escapeIdentifier(table.constructor.name)}
                        add index(${this._adapter.escapeIdentifier(this._name)})
                    `;
                }
        
                return this;
            },
        
            async drop(){
                const table = this._table;
                const database = table._database;
        
                if(await this.exists()){
                    await database.run`
                        alter table ${this._adapter.escapeIdentifier(table.constructor.name)}
                        drop ${this._adapter.escapeIdentifier(this._name)}
                    `;
                    this._type = undefined;
                }
        
                return this;
            }
        },

        row: {
            async update(arg1){
                const fields = typeof arg1 == 'object' ? arg1 : {};
                const fn = typeof arg1 == 'function' ? arg1 : () => {};
        
                await this._database.transaction(async () => {
                    this._updateLevel++;
                    Object.assign(this, fields);
                    await fn.call(this, this);
                    this._updateLevel--;
        
                    if(this._updateLevel == 0){
                        if(this._fields.id === undefined){
                            await this.validate();
                            await this._runBeforeInsertCallbacks();
                            await this._database.run`${this._generateInsertSql()}`;
                            await this._runAfterInsertCallbacks();
                        } else {
                            await this.validate();
                            await this._runBeforeUpdateCallbacks();
                            if(Object.keys(this._alteredFields).length) await this._database.run`${this._generateUpdateSql()}`;
                            await this._runAfterUpdateCallbacks();
                        }
                    }
                });
        
                return this;
            },
        
            async delete(){
                await this._database.transaction(async () => {
                    await this._runBeforeDeleteCallbacks();
                    await this._database.run`delete from ${this._adapter.escapeIdentifier(Inflector.pluralize(this.constructor.name))} where id = uuid_to_bin(${this.id})`;
                    await this._runAfterDeleteCallbacks();
                });
                return this;
            },

            _generateInsertSql(){
                this._fields['id'] = crypto.randomUUID();
                this._alteredFields['id'] = this._fields['id'];
        
                return this._database.renderSql`
                    insert into ${this._adapter.escapeIdentifier(Inflector.pluralize(this.constructor.name))}(
                        ${Object.keys(this._alteredFields).map((key, i) =>
                            this._database.renderSql`${Sql.fromString(i > 0 ? ', ' : '')}${this._adapter.escapeIdentifier(key)}`
                        )}
                    )
                    values(
                        ${Object.keys(this._alteredFields).map((key, i) => {
                            const value = this._alteredFields[key];
                            const separator = Sql.fromString(i > 0 ? ', ' : '');
                            if(key.match(/^(id|.+Id)$/)){
                                return this._database.renderSql`${separator}uuid_to_bin(${value})`;
                            }
                            return this._database.renderSql`${separator}${value}`;
                        })}
                    )
                `;
            },
        
            _generateUpdateSql(){
                return this._database.renderSql`
                    update ${this._adapter.escapeIdentifier(Inflector.pluralize(this.constructor.name))}
                    set ${Object.keys(this._alteredFields).map((key, i) => {
                        const value = this._alteredFields[key];
                        const separator = Sql.fromString(i > 0 ? ', ' : '');
                        if(key.match(/^(id|.+Id)$/)){
                            return this._database.renderSql`${separator}${this._adapter.escapeIdentifier(key)} = uuid_to_bin(${value})`;
                        }
                        return this._database.renderSql`${separator}${this._adapter.escapeIdentifier(key)} = ${value}`;
                    })}
                    where id = uuid_to_bin(${this._fields.id})
                `;
            },
        },

        table: {
            renderSql(...args){
                return Sql.createRenderer([ this ])(...args);
            },

            toSql(){
                return this._adapter.escapeIdentifier(this._alias);
            },

            where(...args){
                const whereSql = this._joinRoot._whereSql;
                if(whereSql.length){
                    whereSql.push(this.renderSql` and `);
                }
                whereSql.push(this.renderSql(...args));
                return this;
            },
        
            orderBy(column, direction = 'asc'){
                if(!(column instanceof Column)){
                    column = this.__getMissing(column);
                }
                const orderBySql = this._joinRoot._orderBySql;
                if(orderBySql.length){
                    orderBySql.push(this.renderSql`, ${column} ${Sql.fromString(direction == 'desc' ? 'desc' : 'asc')}`);
                } else {
                    orderBySql.push(this.renderSql`${column} ${Sql.fromString(direction == 'desc' ? 'desc' : 'asc')}`);
                }
                return this;
            },

            async first(options = {}){
                return (await this.all({ ...options, limit: Sql.fromString('0, 1') })).pop();
            },
        
            async count(options = {}){
                return Object.values(await this.first({ select: this.renderSql`count(distinct ${this.id})`, ...options })).pop();
            },

            async explain(options = {}){
                return buildQuery(await this._generateSelectSql(options));
            },

            async columns(){
                const out = {};
                if(await this.exists()){
                    const rows = await this._database.run`describe ${this._adapter.escapeIdentifier(this.constructor.name)}`;
                    rows.forEach(row => {
                        const name = row['Field'];
                        let type;
                        if(name == '_id'){
                            type = 'primary_key';
                        } else if(name == 'id'){
                            type = 'alternate_key';
                        } else {
                            type = COLUMN_TYPE_TO_TYPE_MAP[row['Type']] || 'string';
                        }
                        out[name] = new Column(this, name, type);
                    });
                }
                return out;
            },

            async create(){
                await this._database.create();
                if(!await this.exists()){
                    await this._database.run`
                        create table ${this._adapter.escapeIdentifier(this.constructor.name)}(
                            _id int(11) unsigned auto_increment primary key,
                            id binary(16) not null,
                            index(id)
                        )
                    `;
                }
            },
        
            async drop(){
                if(await this.exists()){
                    await this._database.run`drop table ${this._adapter.escapeIdentifier(this.constructor.name)}`;
                }
            },

            async __getMissing(name){
                const columns = await this.columns();
                let matches = name.match(COMPARISON_OPERATOR_METHOD_PATTERN);
                if(matches){
                    const column = columns[matches[1]];
                    if(column){
                        if(name.match(KEY_COMPARISON_OPERATOR_METHOD_PATTERN)){
                            return (value) => this.where`${KEY_COMPARISON_OPERATORS[matches[2]](column, value)}`;
                        }
                        return (value) => this.where`${COMPARISON_OPERATORS[matches[2]](column, value)}`;
                    } else {
                        return () => this.where`1 = 2`;
                    }
                }
                return columns[name] || new Column(this, name);
            },

            _joinToUnion(relationship){
                const unionClass = Union.classes[relationship.collectionName]
                const tables = unionClass.tableClasses.map(tableClass => {
                    const out = new tableClass(this._database, this);
                    const joinRoot = out._joinRoot;
                    const fromSql = joinRoot._fromSql;
                    const whereSql = joinRoot._whereSql;
                    fromSql.push(out.renderSql`, ${this._adapter.escapeIdentifier(out.constructor.name)} as ${out}`);
                    whereSql.push(out.renderSql`${Sql.fromString(whereSql.length ? ' and ' : '')}${this[relationship.fromKey]} = ${this[relationship.toKey]}`);
                    return out;
                });
                return new unionClass(this._database, tables);
            },
        
            _joinToTable(relationship){
                const out = Table.create(relationship.collectionName, this._database, this);
                const joinRoot = out._joinRoot;
                const fromSql = joinRoot._fromSql;
                const whereSql = joinRoot._whereSql;
                fromSql.push(out.renderSql`, ${this._adapter.escapeIdentifier(out.constructor.name)} as ${out}`);
                whereSql.push(out.renderSql`${Sql.fromString(whereSql.length ? ' and ' : '')}${this[relationship.fromKey]} = ${out[relationship.toKey]}`);
                return out;
            },

            _generateFromSql(){
                return this.renderSql`${this._adapter.escapeIdentifier(this.constructor.name)} as ${this}`
            },
        
            async _generateSelectSql(options = {}){
                const columns = await this.columns();
                options = {
                    columnNames: Object.keys(columns),
                    ...options
                };
        
                const out = [this.renderSql`select `];
        
                if(options.hasOwnProperty('select')){
                    out.push(options.select);
                } else {
                    out.push(this.renderSql`distinct `);
                    for(let i in options.columnNames){
                        const columnName = options.columnNames[i];
                        const column = await this.__getMissing(columnName);
                        if(await column.exists()){
                            if(columnName.match(/^(id|.+Id)$/)){
                                out.push(this.renderSql`bin_to_uuid(${column}) as ${this._adapter.escapeIdentifier(columnName)}, `);
                            } else {
                                out.push(this.renderSql`${column} as ${this._adapter.escapeIdentifier(columnName)}, `);
                            }
                        } else {
                            out.push(this.renderSql`null as ${this._adapter.escapeIdentifier(columnName)}, `);
                        }
                    }
                    out.push(this.renderSql`${Inflector.singularize(this.constructor.name)} as \`_type\``);
                }
        
                const joinRoot = this._joinRoot;
                
                if(options.hasOwnProperty('from')){
                    if(options.from){
                        out.push(this.renderSql` from ${options.from}`);
                    }
                } else {
                    out.push(this.renderSql` from ${joinRoot._fromSql}`);
                }
        
                if (options.hasOwnProperty('where')){
                    if(options.where){
                        out.push(this.renderSql` where ${options.where}`);
                    }
                } else if(joinRoot._whereSql.length) {
                    out.push(this.renderSql` where ${joinRoot._whereSql}`);
                }
        
                if(options.hasOwnProperty('orderBy')){
                    if(options.orderBy){
                        out.push(this.renderSql` order by ${options.orderBy}`);
                    }
                } else if(joinRoot._orderBySql.length){
                    out.push(this.renderSql` order by ${joinRoot._orderBySql}`);
                }
        
                if(options.hasOwnProperty('limit')){
                    if(options.limit){
                        out.push(this.renderSql` limit ${options.limit}`);
                    }
                } else if(joinRoot._limit) {
                    const { page, pageSize } = joinRoot._limit;
                    out.push(this.renderSql` limit ${(page - 1) * pageSize}, ${pageSize}`);
                }
        
                return this.renderSql`${out}`;
            },
        },

        union: {
            renderSql(...args){
                return Sql.createRenderer([ this ])(...args);
            },

            orderBy(column, direction = 'asc'){
                const orderBySql = this._orderBySql;
                if(orderBySql.length){
                    orderBySql.push(this.renderSql`, ${this._adapter.escapeIdentifier(column)} ${Sql.fromString(direction == 'desc' ? 'desc' : 'asc')}`);
                } else {
                    orderBySql.push(this.renderSql`${this._adapter.escapeIdentifier(column)} ${Sql.fromString(direction == 'desc' ? 'desc' : 'asc')}`);
                }
                return this;
            },

            async count(options = {}){
                return Object.values(await this.first({select: this.renderSql`count(*)`, ...options})).pop();
            },

            async _generateSelectSql(options = {}){
                const out = [];
                const tables = await extractTables(this._collections);
                if(options.select){
                    out.push(this.renderSql`select ${options.select} from `);
                } else {
                    out.push(this.renderSql`select * from `);
                }
                out.push(this.renderSql`((`);
                while(tables.length){
                    const table = tables.shift();
                    out.push(table._generateSelectSql({
                        columnNames: await this._columnNames(),
                        orderBy: null,
                        limit: null
                    }));
                    if(tables.length){
                        out.push(this.renderSql`) union all (`);
                    }
                }
                out.push(this.renderSql`)) as \`_union\``);
                if(this._orderBySql.length){
                    out.push(this.renderSql` order by ${this._orderBySql}`);
                }
        
                if(this._limit) {
                    const { page, pageSize } = this._limit;
                    out.push(this.renderSql` limit ${(page - 1) * pageSize}, ${pageSize}`);
                }
                return this._database.renderSql`${out}`;
            }
        }
    }
});

const TYPE_TO_COLUMN_TYPE_MAP = {
    primary_key: "int(11) unsigned",
    alternate_key: "binary(16)",
    foreign_key: "binary(16)",
    binary: "longblob",
    boolean: "enum('false','true')",
    date: "date",
    datetime: "datetime",
    decimal: "decimal",
    float: "float",
    integer: "int(11)",
    string: "varchar(255)",
    text: "longtext",
    time: "time",
    timestamp: "datetime"
};

const COLUMN_TYPE_TO_TYPE_MAP = (() => {
    const out = {};
    Object.keys(TYPE_TO_COLUMN_TYPE_MAP).forEach(
        key => out[TYPE_TO_COLUMN_TYPE_MAP[key]] = key
    );
    return out;
})();

const COMPARISON_OPERATORS = {
    Eq: (column, value) => column.renderSql`${column} = ${value}`,
    Ne: (column, value) => column.renderSql`${column} != ${value}`,
    Lt: (column, value) => column.renderSql`${column} < ${value}`,
    Gt: (column, value) => column.renderSql`${column} > ${value}`,
    Le: (column, value) => column.renderSql`${column} <= ${value}`,
    Ge: (column, value) => column.renderSql`${column} >= ${value}`,
    BeginsWith: (column, value) => column.renderSql`${column} like concat(${value}, '%')`,
    EndsWith: (column, value) => column.renderSql`${column} like concat('%', ${value})`,
    Contains: (column, value) => column.renderSql`${column} like concat('%', ${value}, '%')`
};

const KEY_COMPARISON_OPERATORS = {
    Eq: (column, value) => column.renderSql`${column} = uuid_to_bin(${value})`,
    Ne: (column, value) => column.renderSql`${column} != uuid_to_bin(${value})`
};

const COMPARISON_OPERATOR_METHOD_PATTERN = new RegExp(`^(.+)(${Object.keys(COMPARISON_OPERATORS).join('|')})$`);
const KEY_COMPARISON_OPERATOR_METHOD_PATTERN = new RegExp(`^(id|.+Id)(${Object.keys(KEY_COMPARISON_OPERATORS).join('|')})$`);

const buildQuery = sql => {
    const out = [];
    const { strings, interpolatedValues } = sql.flatten();
    while(strings.length || interpolatedValues.length){
        if(strings.length) out.push(strings.shift());
        
        if(interpolatedValues.length) {
            const interpolatedValue = interpolatedValues.shift();
            out.push(mysql.escape(typeof interpolatedValue == 'boolean' ? `${interpolatedValue}` : interpolatedValue));
        }
    }
    return out.join('');
};