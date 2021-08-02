
import { getAllProps } from './get_all_props.js'

export const overload = (variations = {}) => {
    const normalizedVariations = normalizeVariations(variations);
    return function out(...args){
        const types = extractTypes(args);
        let fn = normalizedVariations[types.join(', ')];
        while(!fn){
            fn = normalizedVariations[[ ...types, '...'].join(', ')];
            if(!types.length){
                break;
            }
            types.pop();
        }
        if(!fn){
            if(this){
                getAllProps(this).forEach(name => {
                    if(this[name] === out){
                        throw new Error(`Could not satisfy overloaded method ${name}(${extractTypes(args).join(', ')}).`);
                    }
                });
            }
            throw new Error(`Could not satisfy overloaded function (${extractTypes(args).join(', ')}).`);
        }
        return fn.call(this, ...args);
    };
};

const normalizeVariations = (variations) => {
    const out = {};
    Object.keys(variations).forEach(signature => {
        expandSignature(signature).forEach((expandedSignature) => {
            out[expandedSignature] = variations[signature];
        });
    });
    return out;
};

const expandSignature = (signature, path = [], out = []) => {
    if(typeof signature == 'string') {
        signature = signature.trim().split(/\s*,\s*/).map(segment => {
            if(segment == 'any'){
                segment = 'string|number|bigint|boolean|symbol|object|array|function'
            }
            return segment.split(/\s*\|\s*/);
        });
    }

    if(signature.length){
        const types = signature.shift();
        while(types.length){
            expandSignature(signature.map(types => [...types]), [...path, types.shift()], out);
        }
    } else {
        out.push(path.join(', '));
    }

    return out;
};

const extractTypes = (args) => args.map(arg => {
    if(Array.isArray(arg)){
        return 'array';
    }
    return typeof arg;
});
