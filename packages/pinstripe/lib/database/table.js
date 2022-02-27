
import { Base } from '../base.js';
import { Registrable } from '../registrable.js';
import { Inflector } from '../inflector.js';
import { Union } from './union.js';
import { defineService } from '../service_factory.js';
import { 
    COLUMN_TYPE_TO_FORM_FIELD_TYPE_MAP,
    ALLOWED_TABLE_ADAPTER_COLUMN_TYPES
} from './constants.js';
import { createAdapterDeligator } from './adapter.js';

const deligateToAdapter = createAdapterDeligator('table');

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

            hasMany(name, options = {}){
                this.relationships[name] = {
                    name,
                    collectionName: name,
                    fromKey: 'id',
                    toKey: `${Inflector.singularize(this.name)}Id`,
                    cascadeDelete: !options.through,
                    ...options
                };
                
                const { through } = this.relationships[name];
                
                this.include({
                    get [name](){
                        if(through){
                            const path = [ ...through ];
                            let out = this;
                            while(path.length){
                                const name = path.shift();
                                out = out[name];
                            }
                            return out;
                        }
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
                    cascadeDelete: !options.through,
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
        this._adapter = database._adapter;
        this._database = database;
        this._joinParent = joinParent;
        if(!this._joinParent){
            this._aliasCounters = {};
        }
        this._alias = this._generateAlias(this.constructor.name);

        if(!this._joinParent){
            this._fromSql = [this._generateFromSql()];
            this._whereSql = [];
            this._orderBySql = [];
            this._limit = undefined;
        }
    },

    renderSql: deligateToAdapter('renderSql'),

    concat(collection){
        return new Union(this._database, [this, collection]);
    },

    toSql: deligateToAdapter('toSql'),

    back(count = 1){
        let out = this;
        for(let i = 0; i < count; i++){
            out = out._joinParent;
        }
        return out;
    },

    where: deligateToAdapter('where'),

    orderBy: deligateToAdapter('orderBy'),

    clearOrderBy(){
        this._joinRoot._orderBySql = [];
        return this;
    },

    paginate(page = 1, pageSize = 10){
        this._joinRoot._limit = { page, pageSize };
        return this;
    },

    clearPagination(){
        this._joinRoot._limit = undefined;
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

    first: deligateToAdapter('first'),

    count: deligateToAdapter('count'),

    explain: deligateToAdapter('explain'),

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

    columns: deligateToAdapter('columns'),

    async exists(){
        return Object.keys(await this._database.tables()).includes(this.constructor.name);
    },

    create: deligateToAdapter('create'),

    drop: deligateToAdapter('drop'),

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

    async toTableAdapter(){
        const limit = this._joinRoot._limit;
        const name = this.constructor.name;
        let pageCount = 1;
        let rowCount;
        let page = 1;
        let pageSize;
        let pagination = [];
        const rows = await this.all();
        if(limit){
            page = limit.page;
            pageSize = limit.pageSize;
            rowCount = await this.count({ limit: null });
            pageCount = Math.ceil(rowCount / pageSize);
        } else {
            rowCount = rows.length
            pageSize = rowCount;
        }

        const columns = [];
        const _columns = Object.values(await this.columns());
        while(_columns.length){
            const column = _columns.shift();
            const type = await column.type();
            if(ALLOWED_TABLE_ADAPTER_COLUMN_TYPES.includes(type)) columns.push({
                name: column._name,
                label: Inflector.dasherize(column._name).split(/-/).map(word => Inflector.capitalize(word))
            });
        }

        return { name, pageCount, rowCount, page, pageSize, pagination, rows, columns };
    },

    __getMissing: deligateToAdapter('__getMissing'),

    _join(relationshipName){
        const relationship = this.constructor.relationships[relationshipName]
        if(Union.classes[relationship.collectionName]){
            return this._joinToUnion(relationship);
        }   
        return this._joinToTable(relationship);
    },

    _joinToUnion: deligateToAdapter('_joinToUnion'),

    _joinToTable: deligateToAdapter('_joinToTable'),

    _generateFromSql: deligateToAdapter('_generateFromSql'),

    _generateSelectSql: deligateToAdapter('_generateSelectSql'),

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
