
import { Base } from '../base.js';
import { Registrable } from '../registrable.js';
import { Inflector } from '../inflector.js';
import { Sql } from './sql.js';
import { Column } from './column.js';
import { Union } from './union.js';
import { defineService } from '../service_factory.js';
import { 
    MYSQL_COLUMN_TYPE_TO_TYPE_MAP,
    COMPARISON_OPERATORS,
    KEY_COMPARISON_OPERATORS,
    COMPARISON_OPERATOR_METHOD_PATTERN,
    KEY_COMPARISON_OPERATOR_METHOD_PATTERN,
    COLUMN_TYPE_TO_FORM_FIELD_TYPE_MAP
} from './constants.js';

export const Table = Base.extend().include({
    meta(){
        this.include(Registrable);

        const { register } = this;

        this.assignProps({
            register(name){
                defineService(name, ({ database }) => database[name]);
                return register.call(this, name);
            },

            get relationships(){
                if(!this.hasOwnProperty('_relationships')){
                    this._relationships = {};
                }
                return this._relationships;
            },

            toSql(){
                return Sql.escapeIdentifier(this.name);
            },

            hasMany(name, options = {}){
                this.relationships[name] = {
                    name,
                    collectionName: name,
                    fromKey: 'id',
                    toKey: `${Inflector.singularize(this.name)}Id`,
                    cascadeDelete: true,
                    ...options
                };
                this.include({
                    get [name](){
                        return this._join(name);
                    }
                });
            },

            hasOne(name, options = {}){
                this.relationships[name] = {
                    name,
                    collectionName: Inflector.pluralize(name),
                    fromKey: 'id',
                    toKey: `${name}Id`,
                    cascadeDelete: true,
                    ...options
                };
                this.include({
                    get [name](){
                        return this._join(name);
                    }
                });
            },

            belongsTo(name, options = {}){
                this.relationships[name] = {
                    name,
                    collectionName: Inflector.pluralize(name),
                    fromKey: `${name}Id`,
                    toKey: 'id',
                    cascadeDelete: false,
                    ...options
                };
                this.include({
                    get [name](){
                        return this._join(name);
                    }
                });
            }
        });
    },

    initialize(database, joinParent){
        this._database = database;
        this._joinParent = joinParent;
        if(!this._joinParent){
            this._aliasCounters = {};
        }
        this._alias = this._generateAlias(this.constructor.name);

        if(!this._joinParent){
            this._fromSql = [this.sql`${this.constructor} as ${this}`];
            this._whereSql = [];
            this._orderBySql = [];
            this._limitSql = [];
        }
    },

    concat(collection){
        return new Union(this._database, [this, collection]);
    },

    get sql(){
        return Sql.fromTemplate(this);
    },

    toSql(){
        return Sql.escapeIdentifier(this._alias);
    },

    back(count = 1){
        let out = this;
        for(let i = 0; i < count; i++){
            out = out._joinParent;
        }
        return out;
    },

    where(...args){
        const whereSql = this._joinRoot._whereSql;
        if(whereSql.length){
            whereSql.push(' and ');
        }
        whereSql.push(this.sql(...args));
        return this;
    },

    orderBy(column, direction = 'asc'){
        if(!(column instanceof Column)){
            column = this.__getMissing(column);
        }
        const orderBySql = this._joinRoot._orderBySql;
        if(orderBySql.length){
            orderBySql.push(this.sql`, ${column} ${[direction == 'desc' ? 'desc' : 'asc']}`);
        } else {
            orderBySql.push(this.sql`${column} ${[direction == 'desc' ? 'desc' : 'asc']}`);
        }
        return this;
    },

    clearOrderBy(){
        this._joinRoot._orderBySql = [];
        return this;
    },

    paginate(page = 1, pageSize = 10){
        this._joinRoot._limitSql = [this.sql`${(page - 1) * pageSize}, ${pageSize}`];
        return this;
    },

    clearPagination(){
        this._joinRoot._limitSql = [];
        return this;
    },

    all(options = {}){
        return this._database.run`${this._generateSelectSql(options)}`;
    },

    async forEach(fn){
        const rows = await this.all();
        for(let i = 0; i < rows.length; i++){
            const row = rows[i];
            await fn.call(row, row, i);
        }
        return this;
    },

    async first(options = {}){
        this.paginate(1, 1);
        return (await this.all(options)).pop();
    },

    async count(options = {}){
        return Object.values(await this.first({select: 'count(*)', ...options})).pop();
    },

    async explain(options = {}){
        return (await this._generateSelectSql(options)).toString();
    },

    async insert(...args){
        const { Row } = await import('./row.js');
        return ( await Row.create(Inflector.singularize(this.constructor.name), this._database)).update(...args);
    },

    async update(...args){
        await this._database.transaction(async () => {
            await this.forEach(row => row.update(...args));
        });
        return this;
    },

    async delete(){
        await this._database.transaction(async () => {
            await this.forEach(row => row.delete());
        });
        return this;
    },

    async columns(){
        const out = {};
        if(await this.exists()){
            const rows = await this._database.run`describe ${this.constructor}`;
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
                out[name] = new Column(this, name, type);
            });
        }
        return out;
    },

    async exists(){
        return Object.keys(await this._database.tables()).includes(this.constructor.name);
    },

    async create(){
        await this._database.create();
        if(!await this.exists()){
            await this._database.run`
                create table ${this.constructor}(
                    _id int(11) unsigned auto_increment primary key,
                    id binary(16) not null,
                    index(id)
                )
            `;
        }
    },

    async drop(){
        if(await this.exists()){
            await this._database.run`drop table ${this.constructor}`;
        }
    },

        
    async addColumn(name, ...args){
        return (await this[name]).create(...args);
    },

    async removeColumn(name){
        return (await this[name]).drop();
    },

    destroy(){},

    async toFormAdapter(){
        const title = `Add ${Inflector.singularize(this.constructor.name)}`;

        const fields = [];
        const columns = Object.values(await this.columns());
        while(columns.length){
            const column = columns.shift();
            fields.push({
                name: column._name,
                type: COLUMN_TYPE_TO_FORM_FIELD_TYPE_MAP[await column.type()]
            })
        }

        const submitTitle = title;
        const cancelTitle = 'Cancel';

        return {
            title, fields, submitTitle, cancelTitle,
            
            submit: async (values, success) => {
                return success(await this.insert(values));
            }
        };
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

    _join(relationshipName){
        const relationship = this.constructor.relationships[relationshipName]
        if(Union.classes[relationship.collectionName]){
            return this._joinToUnion(relationship);
        }   
        return this._joinToTable(relationship);
    },

    _joinToUnion(relationship){
        const unionClass = Union.classes[relationship.collectionName]
        const tables = unionClass.tableClasses.map(tableClass => {
            const out = new tableClass(this._database, this);
            const joinRoot = out._joinRoot;
            const fromSql = joinRoot._fromSql;
            const whereSql = joinRoot._whereSql;
            fromSql.push(out.sql`, ${out.constructor} as ${out}`);
            whereSql.push(out.sql`${[whereSql.length ? ' and ' : '']}${this[relationship.fromKey]} = ${this[relationship.toKey]}`);
            let matches;
            if(matches = relationship.fromKey.match(/^(.+)_id$/)){
                whereSql.push(out.sql`and ${this[`${matches[1]}Type`]} = ${Inflector.singularize(out.constructor.name)}`);
            } else if(matches = relationship.to_key.match(/\A(.+)_id\z/)){
                whereSql.push(out.sql`and ${this[`${matches[1]}Type`]} = ${Inflector.singularize(out.constructor.name)}`);
            }
            return out;
        });
        return new unionClass(this._database, tables);
    },

    _joinToTable(relationship){
        const out = Table.create(relationship.collectionName, this._database, this);
        const joinRoot = out._joinRoot;
        const fromSql = joinRoot._fromSql;
        const whereSql = joinRoot._whereSql;
        fromSql.push(out.sql`, ${out.constructor} as ${out}`);
        whereSql.push(out.sql`${[whereSql.length ? ' and ' : '']}${this[relationship.fromKey]} = ${out[relationship.toKey]}`);
        return out;
    },

    async _generateSelectSql(options = {}){
        const columns = await this.columns();
        options = {
            columnNames: Object.keys(columns),
            ...options
        };

        const out = ['select '];

        if(options.select){
            out.push(options.select);
        } else {
            for(let i in options.columnNames){
                const columnName = options.columnNames[i];
                const column = await this.__getMissing(columnName);
                if(await column.exists()){
                    if(columnName.match(/^(id|.+Id)$/)){
                        out.push(this.sql`bin_to_uuid(${column}) as ${Sql.escapeIdentifier(columnName)}, `);
                    } else {
                        out.push(this.sql`${column} as ${Sql.escapeIdentifier(columnName)}, `);
                    }
                } else {
                    out.push(this.sql`null as ${Sql.escapeIdentifier(columnName)}, `);
                }
            }
            out.push(this.sql`${Inflector.singularize(this.constructor.name)} as \`_type\``);
        }

        const joinRoot = this._joinRoot;
        
        if(options.from !== undefined){
            if(options.from){
                out.push(this.sql` from ${[options.from]}`);
            }
        } else {
            out.push(this.sql` from ${joinRoot._fromSql}`);
        }

        if (options.where !== undefined){
            if(options.where){
                out.push(this.sql` where ${[options.where]}`);
            }
        } else if(joinRoot._whereSql.length) {
            out.push(this.sql` where ${joinRoot._whereSql}`);
        }

        if(options.orderBy !== undefined){
            if(options.orderBy){
                out.push(this.sql` order by ${[options.orderBy]}`);
            }
        } else if(joinRoot._orderBySql.length){
            out.push(this.sql` order by ${joinRoot._orderBySql}`);
        }

        if(options.limit !== undefined){
            if(options.limit){
                out.push(this.sql` limit ${[options.limit]}`);
            }
        } else if(joinRoot._limitSql.length) {
            out.push(this.sql` limit ${joinRoot._limitSql}`);
        }

        return this.sql`${out}`;
    },

    _generateAlias(name){
        const aliasCounters = this._joinRoot._aliasCounters;

        if(aliasCounters[name] === undefined){
            aliasCounters[name] = 0;
        }
        aliasCounters[name]++;

        if(aliasCounters[name] == 1){
            return name;
        }

        return `${name}${aliasCounters[name]}`;
    },

    get _joinRoot(){
        if(!this.__joinRoot){
            let out = this;
            while(out._joinParent){
                out = out._joinParent;
            }
            this.__joinRoot = out;
        }
        return this.__joinRoot;
    },

    async __beforeInspect(){
        const exists = await this.exists();
        this._inspectInfo = {
            exists,
            ...(await (async () => {
                if(exists){
                    return {
                        relationships: Object.keys(this.constructor.relationships),
                        columns: Object.keys(await this.columns()),
                        query: await this.explain()
                    };
                }
                return {};
            })())
        };
    },

    __inspect(){
        return `${this.constructor.name} (Table) ${JSON.stringify(this._inspectInfo, null, 2)}`;
    }
});
