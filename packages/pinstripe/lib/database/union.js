
import { Base } from '../base.js';
import { Registrable } from '../registrable.js';
import { AsyncPathBuilder } from '../async_path_builder.js';
import { defineService } from '../service_factory.js';
import { createAdapterDeligator } from './adapter.js';

const deligateToAdapter = createAdapterDeligator('union');

export const Union = Base.extend().include({
    meta(){
        this.include(Registrable);

        const { register } = this;

        this.assignProps({
            register(name){
                defineService(name, ({ database }) => database[name]);
                return register.call(this, name);
            },

            get tableClasses(){
                if(!this.hasOwnProperty('_tableClasses')){
                    this._tableClasses = [];
                }
                return this._tableClasses;
            }
        });
    },
    
    initialize(database, collections, orderBySql = [], pagination, skip = 0){
        this._adapter = database._adapter;
        this._database = database
        this._collections = (collections || this.constructor.tableClasses.map(tableClass => new tableClass(database))).map(collection => {
            if(collection._collections || collection._startObject){
                return collection;
            }
            return AsyncPathBuilder.new(collection);
        });
        this._orderBySql = [ ...orderBySql ];
        this._pagination = pagination;
        this._skipCount = skip
    },

    concat(collection){
        return new Union(this._database, [...this._collections, collection]);
    },

    renderSql: deligateToAdapter('renderSql'),

    orderBy: deligateToAdapter('orderBy'),

    clearOrderBy(){
        this._orderBySql = [];
        return this;
    },

    paginate(page = 1, pageSize = 10){
        this._pagination = { page, pageSize };
        return this;
    },

    clearPagination(){
        this._pagination = undefined;
        return this;
    },

    skip(skipCount){
        this._joinRoot._skipCount = skipCount;
        return this;
    },

    all(options = {}){
        return this._database.run`${this._generateSelectSql(options)}`;
    },

    // can we get rid of this?
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

    count: deligateToAdapter('count'),

    async explain(options = {}){
        return (await this._generateSelectSql(options)).toString();
    },

    destroy(){},

    __getMissing(name){
        return new Union(this._database, this._collections.map(collection => collection[name]), this._orderBySql, this._pagination, this._skipCount);
    },

    __call(...args){
        return new Union(this._database, this._collections.map(collection => collection(...args)), this._orderBySql, this._pagination, this._skipCount);
    },

    _generateSelectSql: deligateToAdapter('_generateSelectSql'),

    async _columnNames(){
        const out = [];
        const tables = await extractTables(this._collections);
        while(tables.length){
            const table = tables.shift();
            Object.keys(await table.columns()).forEach(columnName => {
                if(!out.includes(columnName)){
                    out.push(columnName)
                }
            })
        }
        return out;
    },

    async __beforeInspect(){
        this._inspectInfo = {
            columns: await this._columnNames(),
            query: await this.explain()
        };
    },

    __inspect(){
        return `${this.constructor.hasOwnProperty('name') ? this.constructor.name : 'anonymous'} (Union) ${JSON.stringify(this._inspectInfo, null, 2)}`;
    }
});

export const extractTables = async (_collections) => {
    const out = [];
    const collections = [ ..._collections ];
    while(collections.length){
        const collection = await collections.pop();
        if(collection instanceof Union){
            collections.push(collection._collections);
            continue;
        }
        out.push(collection);
    }
    return out;
};