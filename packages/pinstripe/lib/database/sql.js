
import mysql from 'mysql'; // pinstripe-if-client:

import { Base } from '../base.js';

export const Sql = Base.extend().include({
    meta(){
        this.assignProps({
            fromString(value){
                return new this(value);
            },

            escapeValue(value){
                return this.fromString(mysql.escape(typeof value == 'boolean' ? `${value}` : value));
            },

            escapeIdentifier(identifier){
                return this.fromString(`\`${('' + identifier).replace(/`/g, '')}\``);
            },

            fromTemplate(...args){
                if(Array.isArray(args[0])){
                    return this.fromTemplate(this, ...args);
                }
                if(args.length == 1){
                    const environment = args[0];
                    return (...args) => this.fromTemplate(environment, ...args);
                }
                return (async (environment, _strings, ...interpolatedValues) => {
                    const out = [];
                    const strings = [..._strings];
                    while(strings.length || interpolatedValues.length){
                        if(strings.length){
                            out.push(strings.shift());
                        }
                        if(interpolatedValues.length){
                            out.push(await this.resolveValue(interpolatedValues.shift(), environment));
                        }
                    }
                    return this.fromString(out.join(''));
                })(...args);
            },

            async resolveValue(value, environment){
                value = await value;
                if(value instanceof this) {
                    return value;
                }
                if(Array.isArray(value)){
                    const out = [];
                    const _value = [ ...value ];
                    while(_value.length){
                        out.push(await _value.shift());
                    }
                    return this.fromString(out.join(''));
                }
                if(value && typeof value.toSql == 'function'){
                    return this.resolveValue(value.toSql(), environment);
                }
                if(typeof value == 'function'){
                    return this.resolveValue(value(environment), environment);
                }
                return this.escapeValue(value);
            }
        })
    },

    initialize(value){
        this.value = value;
    },

    toString(){
        return this.value;
    }
});
