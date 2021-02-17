
import { Base } from "../base.js";
import { Sql } from './sql.js';

const TYPE_TO_MYSQL_COLUMN_TYPE_MAP = {
    primary_key: "int(11) unsigned",
    foreign_key: "int(11) unsigned",
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

export const MYSQL_COLUMN_TYPE_TO_TYPE_MAP = (() => {
    const out = {};
    Object.keys(TYPE_TO_MYSQL_COLUMN_TYPE_MAP).forEach(
        key => out[TYPE_TO_MYSQL_COLUMN_TYPE_MAP[key]] = key
    );
    return out;
})();

export const Column = Base.extend().define(dsl => dsl
    .props({
        initialize(table, name, type){
            this._table = table;
            this._name = name;
            this._type = type;
        },

        get sql(){
            return Sql.fromTemplate(this);
        },

        toSql(){
            return this.sql`${this._table}.${Sql.escapeIdentifier(this._name)}`;
        },

        async type(){
            if(!this._type){
                this._type = (await this._table[this._name])._type;
            }
            return this._type;
        },

        async exists(){
            return (await this.type()) !== undefined;
        },

        async create(type = 'string', options = {}){
            options = {
                index: type == 'foreign_key',
                ...options
            };
            const table = this._table;
            const database = table._database;

            await table.create();

            if(!await this.exists()){
                await database.run`
                    alter table ${table.constructor}
                    add column ${Sql.escapeIdentifier(this._name)} ${[TYPE_TO_MYSQL_COLUMN_TYPE_MAP[type]]}
                `;
            }

            if(options.index){
                await database.run`
                    alter table ${table.constructor}
                    add index(${Sql.escapeIdentifier(this._name)})
                `;
            }

            return this;
        },

        async drop(){
            const table = this._table;
            const database = table._database;

            if(await this.exists()){
                await database.run`
                    alter table ${table.constructor}
                    drop ${Sql.escapeIdentifier(this._name)}
                `;
                this._type = undefined;
            }

            return this;
        }

    })
);
