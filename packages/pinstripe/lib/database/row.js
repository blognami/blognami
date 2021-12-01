
import * as crypto from 'crypto';
import * as uuid from 'uuid';

if(!crypto.randomUUID){
    crypto.randomUUID = uuid.v4;
}

import { Base } from '../base.js';
import { Registrable } from '../registrable.js';
import { Validatable } from '../validatable.js';
import { Table } from './table.js';
import { Inflector } from '../inflector.js';
import { Union } from './union.js';
import { Sql } from './sql.js';
import { COLUMN_TYPE_TO_FORM_FIELD_TYPE_MAP } from './constants.js';
import { overload } from '../overload.js';
import { addFileToClient } from '../client.js';

export const Row = Base.extend().include({
    meta(){
        this.include(Registrable);
        this.include(Validatable)

        this.hooks('beforeInsert', 'afterInsert', 'beforeUpdate', 'afterUpdate', 'beforeDelete', 'afterDelete')

        const { register } = this;

        this.assignProps({
            register(name, ...args){
                const out = register.call(this, name, ...args);
                if(!this.abstract){
                    out.tableClass = Table.register(Inflector.pluralize(name));
                }
                return out;
            },

            hasMany(name, ...args){
                this.tableClass.hasMany(name, ...args);
                return this.include({
                    get [name](){
                        return this._database[this.constructor.tableClass.name].idEq(this.id)[name];
                    }
                });
            },

            hasOne(name, ...args){
                this.tableClass.hasOne(name, ...args);
                return this.include({
                    get [name](){
                        return this._database[this.constructor.tableClass.name].idEq(this.id)[name].first();
                    }
                });
            },

            belongsTo(name, ...args){
                this.tableClass.belongsTo(name, ...args);
                return this.include({
                    get [name](){
                        return this._database[this.constructor.tableClass.name].idEq(this.id)[name].first();
                    }
                });
            },

            beforeInsertOrUpdate(fn){
                this.beforeInsert(fn);
                this.beforeUpdate(fn);
                return this;
            },

            canBe(name){
                const that = this;
                Union.register(Inflector.pluralize(name)).include({
                    meta(){
                        if(!this.tableClasses.includes(that.tableClass)){
                            this.tableClasses.push(that.tableClass);
                        }
                    }
                })
                return this;
            }
        });
    },

    async initialize(database, fields = {}){
        this._database = database._environment.database;
        this._fieldTypes = await (async () => {
            const out = {};
            const tableName = Inflector.pluralize(this.constructor.name);
            const columns = await this._database[tableName].columns();
            const fieldNames = Object.keys(columns);
            while(fieldNames.length){
                const fieldName = fieldNames.shift();
                const column = columns[fieldName];
                out[fieldName] = await column.type();
            }
            return out;
        })();
        this._fields = this._normalizeFields(fields);
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
            await this._database.run`delete from ${Sql.escapeIdentifier(Inflector.pluralize(this.constructor.name))} where id = uuid_to_bin(${this.id})`;
            await this._runAfterDeleteCallbacks();
        });
        return this;
    },

    async toFormAdapter(){
        const title = `Edit ${this.constructor.name}`;

        const fields = [];
        const columns = Object.values(await this._database[this.constructor.tableClass.name].columns());
        while(columns.length){
            const column = columns.shift();
            fields.push({
                name: column._name,
                type: COLUMN_TYPE_TO_FORM_FIELD_TYPE_MAP[await column.type()],
                value: this[column._name]
            })
        }

        const submitTitle = 'Save Changes';
        const cancelTitle = 'Cancel';

        return {
            title, fields, submitTitle, cancelTitle,
            
            submit: async (values, success) => {
                return success(await this.update(values));
            }
        };
    },

    __setMissing(name, value){
        if(name == 'id'){
            throw "Id fields can't be set directly on a row";
        }
        const normalizedValue = this._normalizeField(name, value)
        if(this._fields[name] != normalizedValue){
            this._alteredFields[name] = normalizedValue;
        }
    },

    __getMissing(name){
        return {...this._fields, ...this._alteredFields}[name];
    },

    __keys(){
        return Object.keys({...this._fields, ...this._alteredFields});
    },

    _generateInsertSql(){
        this._fields['id'] = crypto.randomUUID();
        this._alteredFields['id'] = this._fields['id'];

        return this._database.sql`
            insert into ${Sql.escapeIdentifier(Inflector.pluralize(this.constructor.name))}(
                ${Object.keys(this._alteredFields).map((key, i) =>
                    this._database.sql`${[i > 0 ? ', ' : '']}${Sql.escapeIdentifier(key)}`
                )}
            )
            values(
                ${Object.keys(this._alteredFields).map((key, i) => {
                    const value = this._alteredFields[key];
                    const separator = [i > 0 ? ', ' : ''];
                    if(key.match(/^(id|.+Id)$/)){
                        return this._database.sql`${separator}uuid_to_bin(${value})`;
                    }
                    return this._database.sql`${separator}${value}`;
                })}
            )
        `;
    },

    _generateUpdateSql(){
        return this._database.sql`
            update ${this._database.sql(Inflector.pluralize(this.constructor.name))}
            set ${Object.keys(this._alteredFields).map((key, i) => {
                const value = this._alteredFields[key];
                const separator = [i > 0 ? ', ' : ''];
                if(key.match(/^(id|.+Id)$/)){
                    return this._database.sql`${separator}${Sql.escapeIdentifier(key)} = uuid_to_bin(${value})`;
                }
                return this._database.sql`${separator}${Sql.escapeIdentifier(key)} = ${value}`;
            })}
            where id = uuid_to_bin(${this._fields.id})
        `;
    },

    _normalizeFields(fields = {}){
        const out = {};
        const names = Object.keys(fields);
        names.forEach(name => {
            out[name] = this._normalizeField(name, fields[name]);
        });
        return out;
    },

    _normalizeField(name, value){
        const type = this._fieldTypes[name];
        if(type == 'boolean'){
            if(typeof value == 'string') return value == 'true';
            return !!value;
        }
        return value;
    },

    async __beforeInspect(){
        this._inspectInfo = {
            relationships: Object.keys(this.constructor.tableClass.relationships),
            fields: this._fields
        };
    },

    __inspect(){
        return `${this.constructor.name} (Row) ${JSON.stringify(this._inspectInfo, null, 2)}`;
    }
});

export const defineModel = overload({
    ['string, object'](name, include){
        const abstract = include.abstract;
        delete include.abstract;
        Row.register(name, abstract).include(include);
    }
});

export const modelImporter = dirPath => {
    return async filePath => {
        const relativeFilePath = filePath.substr(dirPath.length).replace(/^\//, '');

        if(filePath.match(/\.js$/)){
            const relativeFilePathWithoutExtension = relativeFilePath.replace(/\.[^/]+$/, '');
            if(relativeFilePathWithoutExtension == '_importer'){
                return;
            }
            addFileToClient(filePath);
            const definition = await ( await import(filePath) ).default;
            if(definition !== undefined){
                defineModel(relativeFilePathWithoutExtension, definition);
            }
            return;
        }
    };
};