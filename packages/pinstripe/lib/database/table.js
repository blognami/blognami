
import { Class } from '../class.js';
import { inflector } from '../inflector.js';
import { Registry } from '../registry.js';
import { TableReference } from "./table_reference.js";
import {
    MYSQL_COLUMN_TYPE_TO_TYPE_MAP,
    TYPE_TO_MYSQL_COLUMN_TYPE_MAP,
    SQLITE_COLUMN_TYPE_TO_TYPE_MAP,
    TYPE_TO_SQLITE_COLUMN_TYPE_MAP,
    COMPARISON_OPERATORS,
    MYSQL_KEY_COMPARISON_OPERATORS,
    TYPE_TO_DEFAULT_VALUE_MAP,
    COLUMN_TYPE_TO_FORM_FIELD_TYPE_MAP
} from './constants.js';
import { Union } from "./union.js";

export const Table = Class.extend().include({
    meta(){
        this.assignProps({ name: 'Table' });

        this.include(Registry);

        this.assignProps({
            get rowName(){
                if(!this.hasOwnProperty('_rowName')){
                    this._rowName = inflector.singularize(this.name);
                }
                return this._rowName;
            },

            get columns(){
                if(!this.hasOwnProperty('_columns')){
                    this._columns = {};
                }
                return this._columns;
            },

            get scopes(){
                if(!this.hasOwnProperty('_scopes')){
                    this._scopes = {};
                }
                return this._scopes;
            },

            scope(name, fn){
                this.scopes[name] = fn;
            },

            async loadSchema(client){
                this.mixins = {};
                
                const tableNames = await client.adapt({
                    async mysql(){
                        const rows = await client.run('show tables');
                        return rows.map(row => Object.values(row)[0]);
                    },

                    async sqlite(){
                        const rows = await client.run(`select name from sqlite_schema where type ='table' and name not like 'sqlite_%'`);
                        return rows.map(({ name }) => name);
                    }
                });
            
                while(tableNames.length){
                    const tableName = tableNames.shift();
                    const columns = await client.adapt({
                        async mysql(){
                            const out = {};
                            const rows = await client.run(`describe \`${tableName}\``);
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
                            const rows = await client.run(`pragma table_info(\`${tableName}\`)`);
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
            
                    this.register(tableName, {
                        meta(){
                            Object.keys(columns).forEach(name => {
                                const type = columns[name];

                                this.columns[name] = type;
            
                                Object.keys(COMPARISON_OPERATORS).forEach(suffix => {
                                    const operator = COMPARISON_OPERATORS[suffix];
                                    this.scope(`${name}${suffix}`, function(value){
                                        this.where(operator, this.tableReference.createColumnReference(name), value);
                                    });
                                });
                                client.adapt(this, {
                                    mysql(){
                                        if(name.match(/(^id|Id$)/)){
                                            Object.keys(MYSQL_KEY_COMPARISON_OPERATORS).forEach(suffix => {
                                                const operator = MYSQL_KEY_COMPARISON_OPERATORS[suffix];
                                                this.scope(`${name}${suffix}`, function(value){
                                                    this.where(operator, this.tableReference.createColumnReference(name), value);
                                                });
                                            });
                                        }
                                    },

                                    sqlite(){
                                        // do nothing
                                    }
                                })
                                
                            });
                        }
                    });
                }
            }
        });
    },

    initialize(database, tableReference = TableReference.new(this.constructor.name), expressions = [], joins = [], orderedBy = []){
        this.database = database;
        this.tableReference = tableReference;
        this.expressions = expressions;
        this.joins = joins;
        this.orderedBy = orderedBy;
        this.exists = Object.keys(this.constructor.columns).length > 0;
    },

    clone(){
        return this.constructor.new(
            this.database,
            this.tableReference.clone(),
            [ ...this.expressions],
            [ ...this.joins],
            [ ...this.orderedBy ]
        );
    },

    join(fromKey, collectionName, toKey){
        const type = this.database.info[collectionName];
        if(type == 'union') return joinToUnion.call(this, fromKey, collectionName, toKey);
        if(type == 'table') return joinToTable.call(this, fromKey, collectionName, toKey);
        throw new Error(`Can't join to unknown collection "${collectionName}".`);
    },

    where(...args){
        if(typeof args[0] == 'string' || Array.isArray(args[0])){
            this.expressions.push(args);
            return this;
        }
        const [ scopedBy ] = args;
        if(typeof scopedBy != 'object') throw new Error(`Invalid argument (0) - expected object, array or string.`);
        const names = Object.keys(scopedBy);
        while(names.length){
            const name = names.shift();
            const fn = this.constructor.scopes[name];
            if(!fn) throw new Error(`No such scope "${name}" exists for "${this.constructor.name}".`);
            fn.call(this, scopedBy[name]);
        }
        return this;
    },

    async tap(fn){
        await fn.call(this);
        return this;
    },

    orderBy(...args){
        this.orderedBy.push(args);
        return this;
    },

    paginate(page = 1, pageSize = 10, skipCount = 0){
        this.page = page;
        this.pageSize = pageSize;
        this.skipCount = skipCount;
        return this;
    },

    all(){
        return this.database.run(this.toSql());
    },

    async count(){
        return Object.values(
            (await this.database.run(this.toSql({ select: ['count(distinct ?) ', this.tableReference.createColumnReference('id')]}))).pop()
        ).pop();
    },

    async first(){
        return (await this.paginate(1, 1).all()).shift();
    },

    toSql(options = {}){
        const { columnNames, select } = Object.assign({
            columnNames: Object.keys(this.constructor.columns)
        }, options);

        const out = ['select '];

        if(select) {
            out.push(select);
        } else {
            out.push(`distinct '${this.constructor.rowName}' as \`_type\``);

            columnNames.forEach(columnName => {
                if(this.constructor.columns[columnName]){
                    this.database.client.adapt(this, {
                        mysql(){
                            out.push(
                                columnName.match(/(^id|Id)$/) ? `, bin_to_uuid(?) as \`${columnName}\`` : `, ? as \`${columnName}\``,
                                this.tableReference.createColumnReference(columnName)
                            );
                        },

                        sqlite(){
                            out.push(
                                columnName.match(/(^id|Id)$/) ? `, ? as \`${columnName}\`` : `, ? as \`${columnName}\``,
                                this.tableReference.createColumnReference(columnName)
                            );
                        }
                    });
                } else {
                    out.push(`, NULL as \`${columnName}\``);
                }
            });
        }

        const tableReferences = Object.values(this.joins.reduce((out, [fromColumnReference, toColumnReference]) => ({
            ...out,
            [fromColumnReference.tableReference.alias]: fromColumnReference.tableReference,
            [toColumnReference.tableReference.alias]: toColumnReference.tableReference,
        }), {
            [this.tableReference.alias]: this.tableReference
        }));

        for(let i = 0; i < tableReferences.length; i++){
            const tableReference = tableReferences[i];
            if(i == 0){
                out.push(` from ${tableReference.name}  as ?`, tableReference);
            } else {
                out.push(`, ${tableReference.name} as  ?`, tableReference );
            }
        }

        if(this.joins.length || this.expressions.length) out.push(' where');

        for(let i = 0; i < this.joins.length; i++){
            const [ fromColumnReference, toColumnReference ] = this.joins[i];
            out.push(i > 0 ? ' and (? = ?)' : ' (? = ?)', fromColumnReference, toColumnReference);
        }

        for(let i = 0; i < this.expressions.length; i++){
            const expression = this.expressions[i];
            out.push(i > 0 || this.joins.length ? ' and (' : ' (', ...expression, ')');
        }

        for(let i = 0; i < this.orderedBy.length; i++){
            const [ columnName, direction = 'asc' ] = this.orderedBy[i];
            out.push(i == 0 ? ' order by ' : ', ');
            out.push(`? ${direction == 'asc' ? 'asc' : 'desc'}`, this.tableReference.createColumnReference(columnName));
        }
        
        if(typeof this.pageSize == 'number'){
            out.push(' limit ?', this.pageSize);
        }

        let offset = 0;

        if(typeof this.page == 'number' && typeof this.pageSize == 'number'){
            offset = (this.page - 1) * this.pageSize;
        }

        if(typeof this.skipCount == 'number'){
            offset = offset + this.skipCount;
        }

        if(offset > 0){
            out.push(' offset ?', offset);
        }

        return out;
    },

    async create(){
        if(this.exists) return;
        
        const tableNames = await this.database.client.adapt(this, {
            async mysql(){
                const rows = await this.database.run('show tables');
                return rows.map(row => Object.values(row)[0]);
            },

            async sqlite(){
                const rows = await this.database.run(`select name from sqlite_schema where type ='table' and name not like 'sqlite_%'`);
                return rows.map(({ name }) => name);
            }
        });

        if(!tableNames.includes(this.constructor.name)){
            await this.database.client.adapt(this, {
                async mysql(){
                    await this.database.run([
                        `create table \`${this.constructor.name}\`(`,
                            `_id int(11) unsigned auto_increment primary key, `,
                            `id binary(16) not null, `,
                            `index(id)`,
                        `)`
                    ]);
                },

                async sqlite(){
                    await this.database.run([
                        `create table \`${this.constructor.name}\`(`,
                            `_id integer primary key autoincrement, `,
                            `id varchar not null`,
                        `)`
                    ]);
                    await this.database.run([
                        `create unique index index__${this.constructor.name}__id on \`${this.constructor.name}\` (id)`
                    ]);
                }
            });
        }

        await this.database.reset();

        this.exists = true;
    },

    async addColumn(name, type, options = {}){
        const { index = ['alternate_key', 'foreign_key'].includes(type), default: _default = TYPE_TO_DEFAULT_VALUE_MAP[type],  } = options;
        
        await this.create();

        const columnNames = await this.database.client.adapt(this, {
            async mysql(){
                const rows = await this.database.run(`describe ${this.constructor.name}`);
                return rows.map(row => row['Field']);
            },

            async sqlite(){
                const rows = await this.database.run(`pragma table_info(\`${this.constructor.name}\`)`);
                return rows.map(({ name }) => name);
            }
        });
        if(columnNames.includes(name)) return;

        await this.database.client.adapt(this, {
            async mysql(){
                const query = [`alter table \`${this.constructor.name}\` add column \`${name}\` ${TYPE_TO_MYSQL_COLUMN_TYPE_MAP[type]}`]

                if(_default !== undefined){
                    query.push(` default ?`, _default);
                }

                await this.database.run(query);
            },

            async sqlite(){
                let defaultSql = _default;
                if(typeof defaultSql == 'string') {
                    defaultSql = `default '${defaultSql}'`;
                } else if(defaultSql !== undefined){
                    defaultSql = `default ${defaultSql}`;
                } else {
                    defaultSql = '';
                }

                await this.database.run([
                    `alter table \`${this.constructor.name}\` `,
                    `add column \`${name}\` ${TYPE_TO_SQLITE_COLUMN_TYPE_MAP[type]} `,
                    `${defaultSql}`
                ]);
            }
        });

        if(index){
            await this.database.client.adapt(this, {
                async mysql(){
                    await this.database.run([
                        `alter table \`${this.constructor.name}\` `,
                        `add index(\`${name}\`)`
                    ]);
                },

                async sqlite(){
                    await this.database.run([
                        `create index index__${this.constructor.name}__${name} `,
                        `on \`${this.constructor.name}\` (${name})`
                    ]);
                }
            });
        }

        await this.database.reset();
    },

    async removeColumn(name){
        await this.database.client.adapt(this, {
            async mysql(){
                await this.database.run(`alter table \`${this.constructor.name}\` drop column \`${name}\``);
            },

            async sqlite(){
                await database.run([
                    `alter table \`${this.constructor.name}\` `,
                    `drop \`${name}\``
                ]);
            }
        });
        await this.database.reset();
    },

    async insert(fields = {}){
        return this.database.transaction(async () => {
            const { Row } = await import('./row.js');
            return Row.create(this.constructor.rowName, this.database, fields).update();
        });
    },

    async update(fields = {}){
        return this.database.transaction(async () => {
            const rows = await this.all();
            while(rows.length){
                await rows.shift().update(fields);
            }
            return this;
        });
    },

    async delete(){
        return this.database.transaction(async () => {
            const rows = await this.all();
            while(rows.length){
                await rows.shift().delete();
            }
            return this;
        });
    },

    async toFormAdapter(){
        const title = `Add ${inflector.singularize(this.constructor.name)}`;

        const fields = [];
        Object.keys(this.constructor.columns).forEach(name => {
            const type = this.constructor.columns[name];
            fields.push({
                name,
                type: COLUMN_TYPE_TO_FORM_FIELD_TYPE_MAP[type]
            })
        })

        const submitTitle = title;
        const cancelTitle = 'Cancel';
        const unsavedChangesConfirm = 'There are unsaved changes are you sure you want to close?';

        return {
            title, fields, submitTitle, cancelTitle, unsavedChangesConfirm,
            
            submit: async (values, success) => {
                return success(await this.insert(values));
            }
        };
    }
});

Union.Table = Table;

function joinToUnion(fromKey, collectionName, toKey){
    return Union.new(
        this.database,
        Union.tableNamesFor(collectionName).map(tableName => joinToTable.call(this.clone(), fromKey, tableName, toKey))
    );
}

function joinToTable(fromKey, tableName, toKey){
    const fromColumnReference = this.tableReference.createColumnReference(fromKey);
    const toTableReference = this.tableReference.createTableReference(tableName)
    const toColumnReference = toTableReference.createColumnReference(toKey);

    this.joins.push([fromColumnReference, toColumnReference]);

    return Table.create(
        tableName,
        this.database,
        toTableReference,
        this.expressions,
        this.joins,
        this.orderedBy
    );
}
