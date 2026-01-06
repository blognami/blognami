
import crypto from 'crypto';

import { ImportableRegistry, Model, Workspace } from 'pinstripe';
import { Table } from "./table.js";
import { TableReference } from './table_reference.js';
import { defer } from '@pinstripe/utils';
import { inflector } from '@pinstripe/utils';
import { COLUMN_TYPE_TO_FORM_FIELD_TYPE_MAP, KEY_TYPES } from './constants.js';

export const Row = Model.extend().include({
    meta(){
        this.assignProps({ name: 'Row' });

        this.include(ImportableRegistry);

        this.assignProps({
            normalizeName(name){
                return inflector.camelize(name);
            },

            get collectionName(){
                if(!this.hasOwnProperty('_collectionName')){
                    this._collectionName = inflector.pluralize(this.name);
                }
                return this._collectionName;
            },

            get abstract(){
                return !Table.mixins[this.collectionName];
            },

            get singleton(){
                return this.for('singleton').includedIn.includes(this.name);
            },

            includeInTable(...args){
                if(this.abstract) return;

                Table.for(this.collectionName).include(...args);
            },

            scope(...args){
                this.includeInTable({
                    meta(){
                        this.scope(...args);
                    }
                });
            },

            hasMany(name, options = {}){
                defineRelationship.call(this, {
                    name,
                    type: 'plural',
                    collectionName: name,
                    fromKey: 'id',
                    toKey: `${this.name}Id`,
                    cascadeDelete: !options.through,
                    ...options
                });
            },

            hasOne(name, options = {}){
                defineRelationship.call(this, {
                    name,
                    type: 'singular',
                    collectionName: inflector.pluralize(name),
                    fromKey: 'id',
                    toKey: `${name}Id`,
                    cascadeDelete: !options.through,
                    ...options
                });
            },

            belongsTo(name, options = {}){
                defineRelationship.call(this, {
                    name,
                    type: 'singular',
                    collectionName: inflector.pluralize(name),
                    fromKey: `${name}Id`,
                    toKey: 'id',
                    cascadeDelete: false,
                    ...options
                });
            },

            mustBeUnique(name, options = {}){
                const { message = 'Must be unique', collection = this.collectionName } = options;
                return this.addHook('validation', async function(){
                    if(this.isValidationError(name)) return;
                    const value = this[name];
                    const alreadyExists = await this.database[collection].where({ [name]: value, idNe: this.id }).count() > 0;
                    if(alreadyExists) this.setValidationError(name, message);
                });
            }
        });
    },

    initialize(database, fields = {}, exists = false){
        this.database = database;
        this.workspace = Workspace.new(database.context);
        this._initialFields = {};
        this._exists = exists;
        
        const columns = Table.for(this.constructor.collectionName).columns;
        Object.keys(fields).forEach(name => {
            if(columns[name] || isSetter(this, name)){
                this[name] = coerceValue.call(this, name, fields[name]);
                if(exists) this._initialFields[name] = fields[name];
            }
        });

        if(!exists) this.id = crypto.randomUUID();
    },

    async update(fields = {}, options = {}){
        const { validateWith } = options;

        return this.database.transaction(async () => {
            const columns = Table.for(this.constructor.collectionName).columns;
            
            Object.keys(fields).forEach(name => {
                if(columns[name] || isSetter(this, name)){
                    this[name] = coerceValue.call(this, name, fields[name]);
                }
            });

            if(this._exists) this.id = this._initialFields.id;
            
            await (this._exists ? this.runHook('beforeUpdate') : this.runHook('beforeInsert'));

            await this.validate({ validateWith});

            const modifiedFields = {};
            Object.keys(this).forEach(name => {
                if(!columns[name]) return;
                if(this[name] != this._initialFields[name]){
                    modifiedFields[name] = this[name];
                }
            });

            const exists =  this._exists;
            
            if(Object.keys(modifiedFields).length) {
                const query = [];

                const tableReference = TableReference.new(this.constructor.collectionName);

                if(exists){
                    query.push('update ? set ', tableReference);
                    Object.keys(modifiedFields).forEach((name, i) => {
                        if(name == 'id') return;
                        this.database.client.adapt({
                            mysql(){
                                if(KEY_TYPES.includes(columns[name])){
                                    query.push(i > 0 ? ', ? = uuid_to_bin(?)' : '? = uuid_to_bin(?)', tableReference.createColumnReference(name), modifiedFields[name]);
                                } else {
                                    query.push(i > 0 ? ', ? = ?' : '? = ?', tableReference.createColumnReference(name), modifiedFields[name]);
                                }
                            },

                            sqlite(){
                                query.push(i > 0 ? `, \`${name}\` = ?` : `\`${name}\` = ?`, modifiedFields[name]);
                            }
                        });
                    });
                    this.database.client.adapt(this, {
                        mysql(){
                            query.push(' where ? = uuid_to_bin(?)', tableReference.createColumnReference('id'), this._initialFields.id);
                        },

                        sqlite(){
                            query.push(' where ? = ?', tableReference.createColumnReference('id'), this._initialFields.id);
                        }
                    });
                } else {
                    query.push('insert into ?(', tableReference);
                    Object.keys(modifiedFields).forEach((name, i) => {
                        this.database.client.adapt({
                            mysql(){
                                query.push(i > 0 ? ', ?' : '?', tableReference.createColumnReference(name));
                            },

                            sqlite(){
                                query.push(i > 0 ? `, \`${name}\`` : `\`${name}\``,);
                            }
                        });
                    });
                    query.push(') values(');
                    Object.keys(modifiedFields).forEach((name, i) => {
                        if(KEY_TYPES.includes(columns[name])){
                            this.database.client.adapt({
                                mysql(){
                                    query.push(i > 0 ? ', uuid_to_bin(?)' : 'uuid_to_bin(?)', modifiedFields[name]);
                                },

                                sqlite(){
                                    query.push(i > 0 ? ', ?' : '?', modifiedFields[name]);
                                }
                            });
                        } else {
                            query.push(i > 0 ? ', ?' : '?', modifiedFields[name]);
                        }
                    });
                    query.push(')');
                }

                await this.database.run(query);

                Object.keys(modifiedFields).forEach(name => {
                    this[name] = modifiedFields[name];
                    this._initialFields[name] = modifiedFields[name];
                });

                this._exists = true;
            }

            await (exists ? this.runHook('afterUpdate') : this.runHook('afterInsert'));

            return this;
        });
    },

    async delete(){
        return this.database.transaction(async () => {
            await this.runHook('afterDelete');

            const tableReference = TableReference.new(this.constructor.collectionName);

            await this.database.client.adapt(this, {
                async mysql(){
                    await this.database.run([
                        'delete from ?', tableReference,
                        ' where id = uuid_to_bin(?)', this.id
                    ]);
                },

                async sqlite(){
                    await this.database.run([
                        'delete from ?', tableReference,
                        ' where id = ?', this.id
                    ]);
                }
            });

            await this.runHook('afterDelete');

            return this;
        });
    },

    async toFormAdapter(){
        const title = inflector.humanize(`Edit ${this.constructor.name}`);

        const fields = [];
        const columns = Table.for(this.constructor.collectionName).columns;
        const names = [...new Set([ ...Object.keys(columns), ...extractSettableProps(this) ])];
        while(names.length){
            const name = names.shift();
            const value = await this[name];
            const type = columns[name] ? columns[name] : typeof value;
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
            
            submit: async (values, options = {}) => {
                const { success = () => {}, validateWith } = options;
                return success(await this.update(values, { validateWith }));
            }
        };
    },
});

function defineRelationship({ name, type, collectionName, fromKey, toKey, cascadeDelete, through }){
    if(this.abstract) return;

    this.includeInTable({
        meta(){
            this.prototype.assignProps({
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
                    return this.join(fromKey, collectionName, toKey);
                }
            });
        }
    });

    this.scope(name, function(scopedBy = {}){
        this[name].where(scopedBy);
    });

    if(cascadeDelete) {
        this.addHook('afterDelete', async function(){
            await this[name].delete();
        });
    }

    this.prototype.assignProps({
        get [name](){
            return defer(() => {
                if(fromKey != 'id'){
                    const out = this.database[collectionName].where({ [toKey]: this[fromKey] });
                    if(type == 'singular') return out.first();
                    return out;
                }
                const out = this.database[this.constructor.collectionName].where({ id: this.id })[name];
                if(type == 'singular') return out.first();
                return out;
            });
        }
    });
}

const isSetter = (o, name) => {
    const descriptor = getPropertyDescriptor(o, name);
    return descriptor && descriptor.set;
};

const getPropertyDescriptor = (o, name) => o ? Object.getOwnPropertyDescriptor(o, name) || getPropertyDescriptor(Object.getPrototypeOf(o), name) : undefined;

function coerceValue(name, value){
    const columns = Table.for(this.constructor.collectionName).columns;
    const type = columns[name];
    if(type == 'date' || type == 'datetime') return value != undefined ? new Date(value) : value;
    if(type == 'boolean') return `${value}` == 'true' || `${value}` == '1';
    return value;
}

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

const getAllProps = (o, out = []) => {
    Object.getOwnPropertyNames(o).forEach(name => {
        if(!out.includes(name)){
            out.push(name);
        }
    });
    if(o.__proto__){
        getAllProps(o.__proto__, out);
    }
    return out;
};