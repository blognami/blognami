

import { Class } from './class.js';
import { Inflector } from './inflector.js';

const optionPattern = /^-([a-z]|-[a-z\-]+)$/;

export const ArgsParser = Class.extend().include({
    meta(){
        this.assignProps({
            parseArgs(args, fn){
                return this.new([ ...args ]).parseArgs(fn);
            }
        });
    },

    initialize(args){
        this.args = [ ...args];
    },
    
    extractArg(_default){
        if(this.args[0] && !this.args[0].match(optionPattern)){
            return this.args.shift();
        }
        return _default;
    },
    
    extractArgs(){
        const out = [];
        while(this.args[0] && !this.args[0].match(optionPattern)){
            out.push(this.args.shift())
        }
        return out;
    },
    
    extractFields(){
        this.extractArgs().map(arg => {
            const matches = arg.match(/^(\^|)([^:]*)(:|)(.*)$/);
            const mandatory = matches[1] == '^';
            const name = Inflector.instance.camelize(matches[2]);
            const type =  matches[4] || 'string';
            return {
                mandatory,
                name,
                type
            };
        });
    },
    
    extractOptions(_default = {}){
        const out = {};
        let currentName;
        while(this.args.length){
            const arg = this.args.shift();
            const matches = arg.match(optionPattern);
            if(matches){
                currentName = Inflector.instance.camelize(matches[1]);
                if(out[currentName] === undefined){
                    out[currentName] = [];
                }
            } else if(currentName){
                out[currentName].push(arg);
            }
        }
        Object.keys({ ...out, ..._default }).forEach(name => {
            const value = out[name];
            if(value === undefined){
                out[name] = _default[name];
            } else if(!value.length){
                out[name] = true;
            } else if(!Array.isArray(_default[name])){
                out[name] = value.join(' ');
            }
        });
        return out;
    },

    parseArgs(fn){
        const extractArg = (...args) => this.extractArg(...args);
        const extractArgs = (...args) => this.extractArgs(...args);
        const extractFields = (...args) => this.extractFields(...args);
        const extractOptions = (...args) => this.extractOptions(...args);

        return fn({ extractArg, extractArgs, extractFields, extractOptions });
    }
});


