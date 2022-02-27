
import { Base } from '../base.js';

export const Sql = Base.extend().include({
    meta(){
        this.assignProps({
            fromString(value){
                return this.new([ value ]);
            },

            escapeValue(value){
                return this.new(['', ''], [ value ])
            },

            async resolveValue(value, context){
                value = await value;
                if(value instanceof Sql) {
                    return value;
                }
                if(Array.isArray(value)){
                    const strings = [''];
                    const interpolatedValues = [];
                    const _value = [ ...value ];
                    while(_value.length){
                        interpolatedValues.push(await this.resolveValue(_value.shift(), context));
                        strings.push('');
                    }
                    return this.new(strings, interpolatedValues);
                }
                if(value && typeof value.toSql == 'function'){
                    return this.resolveValue(value.toSql(), context);
                }
                if(typeof value == 'function'){
                    return this.resolveValue(value(...context), context);
                }
                return this.escapeValue(value);
            },
        
            createRenderer(context){
                return async (strings, ...interpolatedValues) => {
                    const resolvedInterpolatedValues = [];
                    while(interpolatedValues.length){
                        resolvedInterpolatedValues.push(await this.resolveValue(interpolatedValues.shift(), context));
                    }
                    return this.new(strings, resolvedInterpolatedValues);
                };
            }
        })
    },

    initialize(strings = [], interpolatedValues = []){
        this.strings = strings;
        this.interpolatedValues = interpolatedValues;
    },

    flatten(){
        const out = this.constructor.new();
        const strings = [ ...this.strings ];
        const interpolatedValues = [ ...this.interpolatedValues ];
        while(strings.length || interpolatedValues.length){
            if(strings.length) out.strings.push(strings.shift());
            if(interpolatedValues.length){
                let interpolatedValue = interpolatedValues.shift();
                if(interpolatedValue instanceof this.constructor){
                    interpolatedValue = interpolatedValue.flatten();
                    out.strings.push(`${out.strings.pop()}${interpolatedValue.strings.shift()}`);
                    out.strings.push(...interpolatedValue.strings);
                    strings.unshift(`${out.strings.pop()}${strings.shift()}`);
                    out.interpolatedValues.push(...interpolatedValue.interpolatedValues);
                } else {
                    out.interpolatedValues.push(interpolatedValue);
                }
            }
        }
        return out;
    }
});