
import { Base } from '../base.js';
import { Registrable } from '../registrable.js';
import { serviceFactory } from '../service_factory.js';

export const Union = Base.extend().define(dsl => dsl
    .include(Registrable)
    .tap(Class => {
        const register = Class.register;
        Class.define(dsl => dsl
            .classProps({
                register(name){
                    serviceFactory(name, ({ database }) => database[name]);
                    return register.call(this, name);
                }
            })
        );
    })
    .classProps({
        get tableClasses(){
            if(!this.hasOwnProperty('_tableClasses')){
                this._tableClasses = {};
            }
            return this._tableClasses;
        }
    })
    .props({

        initialize(database, collections){
            this._database = database
            this._tables = [];
            (collections || this.constructor.tableClasses.map(tableClass => new tableClass(database))).forEach(collection => {
                if(collection instanceof Union){
                    this._tables.push(...collection._tables);
                } else {
                    this._tables.push(collection);
                }
            });
        },

        concat(collection){
            return new Union(this._database, [...this._tables, collection]);
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

        explain(options = {}){
            return this._generateSelectSql(options);
        },

        // __getMissing(name){
        //     console.log('__getMissing', name);
        //     return (...args) => new Union(this._database, this._tables.map(table => table[name](...args)));
        // },

        async _generateSelectSql(options = {}){
            const out = [];
            for(let i in this._tables){
                const table = this._tables[i];
                if(out.length){
                    out.push(' union all ');
                }
                out.push(table._generateSelectSql({
                    columnNames: await this._columnNames(),
                    orderBy: null,
                    limit: null
                }));
            }
            return this._database.sql`${out}`;
        },

        async _columnNames(){
            const out = [];
            for(let i in this._tables){
                const table = this._tables[i];
                Object.keys(await table.columns()).forEach(columnName => {
                    if(!out.includes(columnName)){
                        out.push(columnName)
                    }
                })
            }
            return out;
        }
    })
);
