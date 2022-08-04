
import { Base } from './base.js';
import { overload } from './overload.js';

export const Html = Base.extend().include({
    meta(){
        this.assignProps({
            escapeValue(value){
                if(value === false || value === undefined || value === null){
                    return '';
                }
                return this.new(`${value}`.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;'));
            },

            async resolveValue(value){
                value = await value;
                if(value instanceof this) {
                    return value;
                }
                if(Array.isArray(value)){
                    const out = [];
                    value = [...value];
                    while(value.length){
                        out.push(await this.resolveValue(value.shift()));
                    }
                    return this.new(out.join(''));
                }
                if(value && typeof value.toHtml == 'function'){
                    return this.resolveValue(value.toHtml());
                }
                if(typeof value == 'function'){
                    return this.resolveValue(value());
                }
                return this.escapeValue(value);
            },

            render: overload({
                async ['array, ...'](_strings, ...interpolatedValues){
                    const out = [];
                    const strings = [..._strings];
                    while(strings.length || interpolatedValues.length){
                        if(strings.length){
                            out.push(strings.shift());
                        }
                        if(interpolatedValues.length){
                            out.push(await this.resolveValue(interpolatedValues.shift()));
                        }
                    }
                    return this.new(out.join(''));
                    
                },

                async ['...'](...values){
                    return this.new((await Promise.all(values)).join(''));
                }
            })
        });
    },

    initialize(value){
        this.value = value;
    },

    toString(){
        return this.value;
    },

    toResponseArray(status = 200, headers = {}){
        return [status, {'content-type': 'text/html', ...headers}, [this.value.trim()]];
    }

});
