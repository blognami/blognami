
import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { dasherize } from './inflector.js';
import { overload } from './overload.js';
import { addFileToClient } from './client.js'; // pinstripe-if-client: const addFileToClient = () => {};

export const StyleSheet = Base.extend().include({
    meta(){
        this.include(Registrable);

        this.assignProps({
            priority: 100,
            
            get cssNamespace(){
                return `.${dasherize(this.name).replace(/\//g, '-')}`;
            },
            
            async compile(environment){
                const out = {};
                const sortedClassNames = extractSortedClassNames();
                while(sortedClassNames.length){
                    const styleSheet = await this.create(sortedClassNames.shift(), environment);
                    const propertyNames = extractPropertyNames(styleSheet);
                    const rules = {};
                    while(propertyNames.length){
                        const name = propertyNames.shift();
                        const value = await styleSheet[name];
                        if(typeof value != 'function'){
                            rules[name] = value;
                        }
                    }
                    deepMerge(out, {
                        [styleSheet.constructor.cssNamespace]: rules
                    });
                }
                return compileRules(out);
            }
        });        
    },

    initialize(environment){
        this.environment = environment;
    },

    __getMissing(name){
        return this.environment[name];
    }
});

const extractSortedClassNames = () => {
    return Object.values(StyleSheet.classes).sort((a, b) => {
        if(a.priority != b.priority){
            return a.priority - b.priority;
        }
        return a.name.localeCompare(b.name);
    }).map(Class => Class.name);
};

const extractPropertyNames = (styleSheet) => {
    const out = [];
    let current = styleSheet;
    while(current.constructor !== StyleSheet){
        Object.getOwnPropertyNames(current).forEach(name => {
            if(!out.includes(name) && name != 'environment') out.push(name);
        });
        current = current.__proto__;
    }
    return out;
};

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
            segment = segment.match(/&/) ? segment : `${i ? '& ' : '&'}${segment}`.replace(/,\s*/g, ', & ');
            selector = selector.split(/,\s*/).map(selector => segment.replace(/&/g, selector)).join(', ');
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
        const value = props[name];
        out.push(`${indent.join('')}${normaliseName(name)}: ${name == 'content' ? `'${value}'` : value};`);
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

export const defineStyleSheet = overload({
    ['string, object'](name, include){
        const abstract = include.abstract;
        delete include.abstract;
        StyleSheet.register(name, abstract).include(include);
    }
});

export const styleSheetImporter = dirPath => {
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
                defineStyleSheet(relativeFilePathWithoutExtension, definition);
            }
            return;
        }
    };
};
