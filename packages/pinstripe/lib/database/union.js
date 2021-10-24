
import { Base } from '../base.js';
import { Registrable } from '../registrable.js';
import { AsyncPathBuilder } from '../async_path_builder.js';
import { defineService } from '../service_factory.js';
import { Sql } from './sql.js';

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
    
    initialize(database, collections, limitSql = []){
        this._database = database
        this._collections = (collections || this.constructor.tableClasses.map(tableClass => new tableClass(database))).map(collection => {
            if(collection._collections || collection._startObject){
                return collection;
            }
            return AsyncPathBuilder.new(collection);
        });
        this._limitSql = [ ...limitSql ];
    },

    concat(collection){
        return new Union(this._database, [...this._collections, collection]);
    },

    get sql(){
        return Sql.fromTemplate(undefined);
    },

    paginate(page = 1, pageSize = 10){
        this._limitSql = [this.sql`${(page - 1) * pageSize}, ${pageSize}`];
        return this;
    },

    clearPagination(){
        this._limitSql = [];
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

    destroy(){},

    __getMissing(name){
        return new Union(this._database, this._collections.map(collection => collection[name]), this._limitSql);
    },

    __call(...args){
        return new Union(this._database, this._collections.map(collection => collection(...args)), this._limitSql);
    },

    async _generateSelectSql(options = {}){
        const out = [];
        const tables = await extractTables(this._collections);
        if(options.select){
            out.push(`select ${options.select} from `);
        } else {
            out.push(`select * from `);
        }
        out.push('((');
        while(tables.length){
            const table = tables.shift();
            out.push(table._generateSelectSql({
                columnNames: await this._columnNames(),
                orderBy: null,
                limit: null
            }));
            if(tables.length){
                out.push(') union all (');
            }
        }
        out.push(')) as `_union`');
        if(this._limitSql.length) {
            out.push(this.sql` limit ${this._limitSql}`);
        }
        return this._database.sql`${out}`;
    },

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

const extractTables = async (_collections) => {
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