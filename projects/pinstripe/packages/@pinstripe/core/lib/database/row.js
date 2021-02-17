

import { Base } from '../base.js';
import { Registrable } from '../registrable.js';
import { Validatable } from '../validatable.js';
import { Table } from './table.js';
import { Inflector } from '../inflector.js';
import { Union } from './union.js';
import { Sql } from './sql.js';

export const Row = Base.extend().define(dsl => dsl
    .include(Registrable)
    .include(Validatable)
    .tap(Class => {
        const register = Class.register;
        Class.define(dsl => dsl
            .classProps({
                register(name){
                    this.tableClass = Table.register(Inflector.pluralize(name));
                    return register.call(this, name);
                }
            })
        );
    })
    .hooks('beforeInsert', 'afterInsert', 'beforeUpdate', 'afterUpdate', 'beforeDelete', 'afterDelete')
    .classProps({
        ['dsl.hasMany'](name, ...args){
           this.tableClass['dsl.hasMany'](name, ...args);
           this['dsl.props']({
               get [name](){
                    return new (this.constructor.tableClass)(this._database).idEq(this.id)[name];
               }
           });
        },

        ['dsl.hasOne'](name, ...args){
            this.tableClass['dsl.hasOne'](name, ...args);
            this['dsl.props']({
                get [name](){
                    return new (this.constructor.tableClass)(this._database).idEq(this.id)[name].first();
                }
            });
        },

        ['dsl.belongsTo'](name, ...args){
            this.tableClass['dsl.belongsTo'](name, ...args);
            this['dsl.props']({
                get [name](){
                    return new (this.constructor.tableClass)(this._database).idEq(this.id)[name].first();
                }
            });
        },

        ['dsl.beforeInsertOrUpdate'](fn){
            this.define(dsl => dsl
                .beforeInsert(fn)
                .beforeUpdate(fn)
            );
        },

        ['dsl.canBe'](name){
            Union.register(Inflector.pluralize(name)).tap(Class => {
                if(!Class.tableClasses.includes(this)){
                    Class.tableClasses.push(this);
                }
            })
        }
    })
    .props({

        initialize(database, fields = {}){
            this._database = database;
            this._fields = fields;
            this._alteredFields = {};
            this._updateLevel = 0;
        },

        async update(arg1){
            const fields = typeof arg1 == 'object' ? arg1 : {};
            const fn = typeof arg1 == 'function' ? arg1 : () => {};

            await this._database.transaction(async () => {
                this._updateLevel++;
                Object.assign(this, fields);
                await fn.call(this, this);
                this._updateLevel--;

                if(this._updateLevel == 0 && Object.keys(this._alteredFields).length){
                    await this.validate();
                    
                    if(this._fields.id === undefined){
                        await this._runBeforeInsertCallbacks();
                        await this._database.run`${this._generateInsertSql()}`;
                        await this._runAfterInsertCallbacks();
                    } else {
                        await this._runBeforeUpdateCallbacks();
                        await this._database.run`${this._generateUpdateSql()}`;
                        await this._runAfterUpdateCallbacks();
                    }
                }
            });

            return this;
        },

        async delete(){
            await this._database.transaction(async () => {
                await this._runBeforeDeleteCallbacks();
                await this._database.run`delete from ${Sql.escapeIdentifier(Inflector.pluralize(this.constructor.name))} where id = ${this.id}`;
                await this._runAfterDeleteCallbacks();
            });
            return this;
        },

        __setMissing(name, value){
            if(name == 'id'){
                throw "Id fields can't be set directly on a row";
            }
            if(this._updateLevel > 0 && this._fields[name] != value){
                this._alteredFields[name] = value;
            }
        },

        __getMissing(name){
            return {...this._fields, ...this._alteredFields}[name];
        },

        _generateInsertSql(){
            return this._database.sql`
                insert into ${Sql.escapeIdentifier(Inflector.pluralize(this.constructor.name))}(
                    ${Object.keys(this._alteredFields).map((key, i) =>
                        this._database.sql`${[i > 0 ? ', ' : '']}${Sql.escapeIdentifier(key)}`
                    )}
                )
                values(
                    ${Object.values(this._alteredFields).map((value, i) =>
                        this._database.sql`${[i > 0 ? ', ' : '']}${value}`
                    )}
                )
            `;
        },

        _generateUpdateSql(){
            return this._database.sql`
                update ${this._database.sql(Inflector.pluralize(this.constructor.name))}
                set ${Object.keys(this._alteredFields).map((key, i) =>
                    this._database.sql`${[i > 0 ? ', ' : '']}${Sql.escapeIdentifier(key)} = ${this._alteredFields[key]}`
                )}
                where id = ${this._fields.id}
            `;
        }

    })
);
