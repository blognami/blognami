import { Class } from './class.js';

export const Style = Class.extend().include({
    initialize(){
        this.className = '&';
        this.condition = ['&'];
        this.properties = {};
    },

    toCssRules(){
        const out = [];
        let nestedRules = { ...this.properties };
        for(const condition of this.condition){
            nestedRules = { [condition]: nestedRules };
        }
        traverse(nestedRules, (path, rules) => {
            const buffer = [];
            for(const [key, value] of Object.entries(rules)){
                if(typeof value == 'object') continue;
                buffer.push(`${key}:${value};`);
            }
            if(buffer.length == 0) return;
            const atRules = [];
            const selectors = [];
            for(const item of path){
                if(item.match(/^@/)){
                    atRules.push(item);
                } else {
                    selectors.push(item.replace(/&/g, `.${this.className}`));
                }
            }
            if(selectors.length == 0) return;
            buffer.unshift(`${selectors.join(' ')} {`);
            buffer.push('}');

            for(const item of atRules){
                buffer.unshift(`${item} {`);
                buffer.push('}');
            }
            out.push(buffer.join(''));
        });
        return out;
    },

    toString(){
        return this.toCssRules().join('\n');
    }
});

function traverse(o, fn, path = []){
    fn(path, o);
    for(const [key, value] of Object.entries(o)){
        if(typeof value === 'object'){
            traverse(value, fn, [ ...path, key ]);
        }
    }
}
