
import { Base } from './base.js';

export const Css = Base.extend().include({
    initialize(){
        this.rules = {};
    },

    appendRules(...rules){
        deepMerge(this.rules, ...rules);
    },

    toString(){
        return compileRules(this.rules);
    }
});

const compileRules = (rules, path = [], out = []) => {
    const props = {};

    Object.keys(rules).forEach(name => {
        const value = rules[name];
        if(typeof value == 'object') return;
        props[name] = value;
    });

    if(path.length && Object.keys(props).length){
        out.push(compileRule(path, props));
    }

    Object.keys(rules).forEach(name => {
        const value = rules[name];
        if(typeof value != 'object') return;
        compileRules(value, [ ...path, name ], out);
    });

    if(!path.length) return out.join('\n');
};

const compileRule = (path, props) => {
    const atRules = [];
    let selector = '';
    path.forEach((segment, i) => {
        if(segment.match(/^@/)){
            atRules.push(segment);
        } else {
            segment = segment.match(/&/) ? segment : `${i ? '& ' : '&'}${segment}`;
            selector = segment.replace(/&/g, selector);
        }
    });

    const out = [];
    const indent = [];

    atRules.forEach(rule => {
        out.push(`${indent.join('')}${rule} {`);
        indent.push('    ');
    });

    out.push(`${indent.join('')}${selector} {`);
    indent.push('    ');
    Object.keys(props).forEach(name => {
        out.push(`${indent.join('')}${normaliseName(name)}: ${props[name]};`);
    })
    indent.pop();
    out.push(`${indent.join('')}}`);

    atRules.forEach(() => {
        indent.pop();
        out.push(`${indent.join('')}}`);
    });

    return out.join('\n');
};

const normaliseName = name => name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const deepMerge = (destination = {}, ...sources) => {
    sources.forEach(source => {
        Object.keys(source).forEach(key => {
            const value = source[key];
            if(typeof value == 'object') {
                destination[key] = deepMerge(typeof destination[key] == 'object' ? destination[key] : {}, value);
            } else {
                destination[key] = source[key];
            }
        });
    });
    return destination;
};
