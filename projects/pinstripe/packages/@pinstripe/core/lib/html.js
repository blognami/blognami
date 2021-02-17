
import { Base } from './base.js';

export const Html = Base.extend().define(dsl => dsl
    .classProps({
        fromString(value){
            return new this(`${value}`);
        },

        escapeValue(value){
            if(value === false || value === undefined || value === null){
                return '';
            }
            return this.fromString(`${value}`.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;'));
        },

        fromTemplate(environment){
            return async (_strings, ...interpolatedValues) => {
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
            };
        },

        async resolveValue(value, environment){
            value = await value;
            if(value instanceof this) {
                return value;
            }
            if(Array.isArray(value)){
                const out = [];
                value = [...value];
                while(value.length){
                    out.push(await this.resolveValue(value.shift(), environment));
                }
                return this.fromString(out.join(''));
            }
            if(value && typeof value.toHtml == 'function'){
                return this.resolveValue(value.toHtml(), environment);
            }
            if(typeof value == 'function'){
                return this.resolveValue(value(environment), environment);
            }
            return this.escapeValue(value);
        }
    })
    .props({
        initialize(value){
            this.value = value;
        },

        toString(){
            return this.value;
        },

        toResponseArray(status = 200, headers = {}){
            return [status, {'Content-Type': 'text/html', ...headers}, [this.value.trim()]];
        }
    })
);
