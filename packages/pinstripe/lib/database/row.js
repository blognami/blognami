import { Base } from '../base.js';
import { Registrable } from '../registrable.js';
import { Validatable } from '../validatable.js';
import { Table } from './table.js';
import { Inflector } from '../inflector.js';
import { Union } from './union.js';
import { COLUMN_TYPE_TO_FORM_FIELD_TYPE_MAP, RESERVED_WORDS } from './constants.js';
import { overload } from '../overload.js';
import { addFileToClient } from '../client.js';
import { defineService } from '../service_factory.js';
import { getAllProps } from '../get_all_props.js';
import { AsyncPathBuilder } from '../async_path_builder.js';
import { createAdapterDeligator } from './adapter.js';

const deligateToAdapter = createAdapterDeligator('row');

export const Row = Base.extend().include({
    meta(){
        this.include(Registrable);
        this.include(Validatable)

        this.hooks('beforeInsert', 'afterInsert', 'beforeUpdate', 'afterUpdate', 'beforeDelete', 'afterDelete')

        const { register } = this;

        this.assignProps({
            register(name, ...args){
                const normalizedName = Inflector.camelize(name);
                if(RESERVED_WORDS.includes(normalizedName)) throw new Error(`'${name}' is a reserved word.`);
                const out = register.call(this, normalizedName, ...args);
                if(!this.abstract){
                    out.tableClass = Table.register(Inflector.pluralize(normalizedName));
                }
                return out;
            },

            hasMany(name, ...args){
                this.tableClass.hasMany(name, ...args);

                if(this.tableClass.relationships[name].cascadeDelete) {
                    this.beforeDelete(async function(){
                        await this[name].delete();
                    });
                }

                return this.include({
                    get [name](){
                        return this._database[this.constructor.tableClass.name].idEq(this.id)[name];
                    }
                });
            },

            hasOne(name, ...args){
                this.tableClass.hasOne(name, ...args);

                if(this.tableClass.relationships[name].cascadeDelete) {
                    this.beforeDelete(async function(){
                        await this[name].delete();
                    });
                }

                return this.include({
                    get [name](){
                        return this._database[this.constructor.tableClass.name].idEq(this.id)[name].first();
                    }
                });
            },

            belongsTo(name, ...args){
                this.tableClass.belongsTo(name, ...args);

                if(this.tableClass.relationships[name].cascadeDelete) {
                    this.beforeDelete(async function(){
                        await this[name].delete();
                    });
                }

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

            afterInsertOrUpdate(fn){
                this.afterInsert(fn);
                this.afterUpdate(fn);
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
            },

            singleton(){
                this.isSingleton = true;
                defineService(this.name, ({ database }) => database[this.name]);
                this.validateWith(async function(){
                    if(!this.isValidationError('general') && !this.id && await this._database[this.constructor.tableClass.name].count() > 0){
                        this.setValidationError('general', `A singleton table can't contain more than one row`);
                    }
                });
            },

            scope(name, fn){
                this.tableClass.include({
                    async [name](...args){
                        const that = AsyncPathBuilder.new(this);
                        await fn.call(that, that, ...args);
                        return this;
                    }
                });
            }
        });
    },

    async initialize(database, fields = {}){
        this._adapter = database._adapter;
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

    update: deligateToAdapter('update'),

    delete: deligateToAdapter('delete'),

    async toFormAdapter(){
        const title = `Edit ${this.constructor.name}`;

        const fields = [];
        const columns = await this._database[this.constructor.tableClass.name].columns();
        const names = [...new Set([ ...Object.keys(columns), ...extractSettableProps(this) ])];
        while(names.length){
            const name = names.shift();
            const column = columns[name];
            let value = await this[name];
            if(typeof value?.toFieldValue == 'function'){
                value = await value.toFieldValue();
            }
            const type = column ? await column.type() : typeof value;
            fields.push({
                name,
                type: COLUMN_TYPE_TO_FORM_FIELD_TYPE_MAP[type],
                value
            })
        }

        const submitTitle = 'Save Changes';
        const cancelTitle = 'Cancel';
        const unsavedChangesConfirm = 'There are unsaved changes are you sure you want to close?';

        return {
            title, fields, submitTitle, cancelTitle, unsavedChangesConfirm,
            
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

    _generateInsertSql: deligateToAdapter('_generateInsertSql'),

    _generateUpdateSql: deligateToAdapter('_generateUpdateSql'),

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

const extractSettableProps = (o) => {
    const out = [];
    getAllProps(o).forEach((name) => {
        if(name.startsWith('_')) return;
        let isSetter = false;
        let current = o;
        while(current){
            const { set } = (Object.getOwnPropertyDescriptor(current, name) || {});
            if(typeof set == 'function') {
                isSetter = true;
                break;
            }
            current = current.__proto__;
        }
        if(isSetter) out.push(name);
    });
    return out;
};

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