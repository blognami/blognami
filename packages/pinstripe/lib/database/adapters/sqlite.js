
import sqlite from 'sqlite3';
import * as crypto from 'crypto';
import { existsSync, unlink } from 'fs';
import { promisify } from 'util';

import { Adapter } from '../adapter.js';
import { Sql } from '../sql.js';
import { TYPE_TO_DEFAULT_VALUE_MAP } from '../constants.js';
import { Inflector } from '../../inflector.js';
import { Column } from '../column.js';
import { Union, extractTables } from '../union.js';
import { Table } from '../table.js';
import { Row } from '../row.js';

let schemaCache = {};
let connection;

Adapter.register('sqlite').include({
    get connection(){
        if(!connection){
            const { filename } = this.config;
            connection = new sqlite.Database(filename);
        }
        return connection;
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
                return true;
            },
        
            async create() {
                // do nothing
            },
        
            async drop() {
                if(connection){
                    await new Promise((resolve, reject) => {
                        connection.close(error => error ? reject(error) : resolve());
                    });
                    connection = undefined;
                }
                schemaCache = {};
                this._sessionCache = {};
                if(existsSync(this._adapter.config.filename)) await promisify(unlink)(this._adapter.config.filename);
            },
        
            async tables(){
                const out = {}
                if(await this.exists()){
                    const rows = await this.run`select name from sqlite_schema where type ='table' and name not like 'sqlite_%'`;
                    rows.forEach(({ name }) => {
                        out[name] = this.__getMissing(name);
                    });
                }
                return out;
            },

            async transaction(fn){
                return fn();
            },
        
            async lock(fn){
                return fn();
            },
        
            async destroy() {
                // do nothing
            },

            async _fetchRows(sql){
                return this._mapRows(await new Promise((resolve, reject) => {
                    const [ query, params ] = buildQuery(sql);
                    if(query.match(/^\s*(create|drop|alter)/im)){
                        schemaCache = {};
                    }
                    if(query.match(/^\s*(create|drop|alter|insert|update|delete)/im)){
                        this._sessionCache = {};
                    }

                    let cache;
                    if(query.match(/^\s*(select\s+([\s\S]+?)\s+from\s+sqlite_schema|pragma)/im)){
                        cache = schemaCache;
                    } else if(query.match(/^\s*select/im)){
                        cache = this._sessionCache;
                    }
                    
                    const cacheKey = JSON.stringify([ query, params ]);
                    if(cache && cache[cacheKey]){
                        resolve(cache[cacheKey]);
                        return;
                    }
        
                    const isDevelopmentEnvironment = (process.env.NODE_ENV || 'development') == 'development';
        
                    if(isDevelopmentEnvironment && this._isInitialized){
                        console.log(`Query: ${query}\n`);
                    }
        
                    this._adapter.connection.all(query, ...params, (error, rows) => {
                        if(error){
                            reject(error);
                        } else {
                            if(!Array.isArray(rows)){
                                rows = [rows || {}];
                            }
        
                            if(cache){
                                cache[cacheKey] = rows;
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
                        const table = await this[Inflector.pluralize(_type)];
                        const mappedFields = {};
                        const names = Object.keys(fields);
                        while(names.length){
                            const name = names.shift();
                            const column = await table[name];
                            if(column && ['date', 'datetime'].includes(await column.type())){
                                mappedFields[name] = new Date(fields[name]);
                            } else {
                                mappedFields[name] = fields[name];
                            }
                        }
                        out.push(await Row.create(_type, this, mappedFields));
                    } else {
                        out.push(fields);
                    }
                }
                return out;
            },

            async _useIfExists(){
                // do nothing
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
        
                if(!await table.exists()) await table.create();
        
                if(!await this.exists()){
                    let defaultSql = options.default;
                    if(typeof defaultSql == 'string') {
                        defaultSql = Sql.fromString(`default '${defaultSql}'`);
                    } else if(defaultSql !== undefined){
                        defaultSql = Sql.fromString(`default ${defaultSql}`);
                    } else {
                        defaultSql = Sql.fromString('');
                    }

                    await database.run`
                        alter table ${this._adapter.escapeIdentifier(table.constructor.name)}
                        add column ${this._adapter.escapeIdentifier(this._name)} ${Sql.fromString(TYPE_TO_COLUMN_TYPE_MAP[type])}
                        ${defaultSql}
                    `;
                }
        
                if(options.index){
                    await database.run`
                        create index index__${Sql.fromString(table.constructor.name)}__${Sql.fromString(this._name)}
                        on ${this._adapter.escapeIdentifier(table.constructor.name)} (${Sql.fromString(this._name)})
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
                    await this._database.run`delete from ${this._adapter.escapeIdentifier(Inflector.pluralize(this.constructor.name))} where id = ${this.id}`;
                    await this._runAfterDeleteCallbacks();
                });
                return this;
            },

            async _generateInsertSql(){
                this._fields['id'] = crypto.randomUUID();
                this._alteredFields['id'] = this._fields['id'];

                const database = await this._database;
                const { isMultiTenant } = database;
                const isScopedToTenant = isMultiTenant && !this.constructor.name.match(/^(pinstripe[A-Z]|tenant$)/);
                const tenant = isScopedToTenant && database._environment ? await database._environment.tenant : undefined;
                if(tenant){
                    this._fields['tenantId'] = tenant.id;
                    this._alteredFields['tenantId'] = tenant.id;
                } else if(isScopedToTenant) {
                    return this._database.renderSql`select NULL`;
                }

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
                                return this._database.renderSql`${separator}${value}`;
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
                            return this._database.renderSql`${separator}${this._adapter.escapeIdentifier(key)} = ${value}`;
                        }
                        return this._database.renderSql`${separator}${this._adapter.escapeIdentifier(key)} = ${value}`;
                    })}
                    where id = ${this._fields.id}
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
                return (await this.all({ ...options, limit: Sql.fromString('1'), offset: Sql.fromString('0')  })).pop();
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
                    const rows = await this._database.run`pragma table_info(${this._adapter.escapeIdentifier(this.constructor.name)})`;
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
                            type = COLUMN_TYPE_TO_TYPE_MAP[row.type] || 'string';
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
                            _id integer primary key autoincrement,
                            id varchar not null
                        )
                    `;
                    await this._database.run`
                        create unique index index__${Sql.fromString(this.constructor.name)}__id on ${this._adapter.escapeIdentifier(this.constructor.name)} (id)
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
                            out.push(this.renderSql`${column} as ${this._adapter.escapeIdentifier(columnName)}, `);
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

                const { isMultiTenant } = this._database;
                const isScopedToTenant = isMultiTenant && !this.constructor.name.match(/^(pinstripe[A-Z]|tenants$)/);
                const tenant = isScopedToTenant ? await this._database._environment.tenant : undefined;
        
                if (options.hasOwnProperty('where')){
                    if(options.where){
                        out.push(this.renderSql` where ${options.where}`);
                        if(tenant){
                            out.push(this.renderSql` and ${this.tenantId} = ${tenant.id}`);
                        } else if(isScopedToTenant){
                            out.push(this.renderSql` where 1 = 2`);
                        }
                    } else if(isScopedToTenant){
                        out.push(this.renderSql` where 1 = 2`);
                    }
                } else if(joinRoot._whereSql.length) {
                    out.push(this.renderSql` where ${joinRoot._whereSql}`);
                    if(tenant){
                        out.push(this.renderSql` and ${this.tenantId} = ${tenant.id}`);
                    } else if(isScopedToTenant){
                        out.push(this.renderSql` and 1 = 2`);
                    }
                } else if(tenant){
                    out.push(this.renderSql` where ${this.tenantId} = ${tenant.id}`);
                } else if(isScopedToTenant){
                    out.push(this.renderSql` where 1 = 2`);
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
                } else if(joinRoot._pagination) {
                    const { pageSize } = joinRoot._pagination;
                    out.push(this.renderSql` limit ${pageSize}`);
                }

                if(options.hasOwnProperty('offset')){
                    if(options.offset){
                        out.push(this.renderSql` offset ${options.offset}`);
                    }
                } else if(joinRoot._pagination || joinRoot._skipCount) {
                    const { page = 1, pageSize = 10 } = joinRoot._pagination || {};
                    out.push(this.renderSql` offset ${((page - 1) * pageSize) + joinRoot._skipCount}`);
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
                out.push(this.renderSql`(`);
                while(tables.length){
                    const table = tables.shift();
                    out.push(table._generateSelectSql({
                        columnNames: await this._columnNames(),
                        orderBy: null,
                        limit: null
                    }));
                    if(tables.length){
                        out.push(this.renderSql` union all `);
                    }
                }
                out.push(this.renderSql`)`);
                if(this._orderBySql.length){
                    out.push(this.renderSql` order by ${this._orderBySql}`);
                }

                if(this._pagination) {
                    const { pageSize } = this._pagination;
                    out.push(this.renderSql` limit ${pageSize}`);
                }

                if(this._pagination || this._skipCount) {
                    const { page = 1, pageSize = 10 } = this._pagination || {};
                    out.push(this.renderSql` offset ${((page - 1) * pageSize) + this._skipCount}`);
                }

                return this._database.renderSql`${out}`;
            }
        }
    }
});

const TYPE_TO_COLUMN_TYPE_MAP = {
    primary_key: "integer",
    alternate_key: "varchar",
    foreign_key: "varchar",
    binary: "blob",
    boolean: "boolean",
    date: "date",
    datetime: "datetime",
    decimal: "decimal",
    float: "float",
    integer: "integer",
    string: "varchar",
    text: "text",
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
    Eq: (column, value) => column.renderSql`${column} = ${value}`,
    Ne: (column, value) => column.renderSql`${column} != ${value}`
};

const COMPARISON_OPERATOR_METHOD_PATTERN = new RegExp(`^(.+)(${Object.keys(COMPARISON_OPERATORS).join('|')})$`);
const KEY_COMPARISON_OPERATOR_METHOD_PATTERN = new RegExp(`^(id|.+Id)(${Object.keys(KEY_COMPARISON_OPERATORS).join('|')})$`);


const buildQuery = sql => {
    const { strings, interpolatedValues } = sql.flatten();
    return [ strings.join('?'), interpolatedValues ];
};
