
import { getAllProps } from './get_all_props.js';

export class Base {

    static assignProps(...args){
        return assignProps(this, ...args);
    }

    static include(...args){
        args.forEach(arg => {
            this.prototype.assignProps(arg, name => name != 'meta');
            if(typeof arg.meta == 'function'){
                arg.meta.call(this);
            }
        });
        return this;
    }

    static new(...args){
        return new this(...args);
    }

    static extend(){
        return class extends this {};
    }

    static get parent(){
        return this.__proto__;
    }
    
    constructor(...args){
        let out = this.initialize(...args);
        if(typeof out == 'object' && typeof out.then == 'function'){
            return out.then(out => out || this.__proxy);
        }
        return out || this.__proxy;
    }

    initialize(){
        
    }

    assignProps(...args){
        return assignProps(this, ...args);
    }

    get __proxy(){
        let out = this;

        const traps = {};

        const isGetMissingMethod = typeof this.__getMissing == 'function';
        const isSetMissingMethod = typeof this.__setMissing == 'function';
        const isCallMethod = typeof this.__call == 'function';
        const isKeysMethod = typeof this.__keys == 'function';

        if(isGetMissingMethod || isCallMethod){
            traps.get = (target, name) => {
                if(getAllProps(this).includes(name) || name.match(/^_/)){
                    return this[name];
                }
                if(isGetMissingMethod && name != 'then'){
                    return this.__proxy.__getMissing(name);
                }
            };
        }
        if(isSetMissingMethod || isCallMethod){
            traps.set = (target, name, value) => {
                if(getAllProps(this).includes(name) || name.match(/^_/)){
                    this[name] = value;
                } else if(isSetMissingMethod){
                    this.__setMissing(name, value);
                }
                return true;
            };
        }
        if(isCallMethod){
            out = () => {};
            out.__proto__ = this;
            traps.apply = (target, thisArg, args) => {
                return this.__call(...args);
            };
        }
        if(isKeysMethod){
            traps.ownKeys = () => {
                return this.__keys();
            };
        }

        if(Object.keys(traps).length){
            out = new Proxy(out, traps);
        }
    
        return out;
    }

    get __this(){
        return this;
    }
    
};

const assignProps = (target, ...sources) => {
    const fn = typeof sources[sources.length - 1] == 'function' ?  sources.pop() :  () => true;

    sources.forEach(source => {
        Object.getOwnPropertyNames(source).forEach(name => {
            if(!fn(name)){
                return;
            }
            const descriptor = { ...Object.getOwnPropertyDescriptor(source, name) };
            const { get } = descriptor;
            if(get){
                descriptor.get = function(...args){
                    return get.call(this.__proxy || this, ...args);
                };
            }
            const { set } = descriptor;
            if(set){
                descriptor.set = function(...args){
                    set.call(this.__proxy || this, ...args);
                };
            }
            Object.defineProperty(target, name, descriptor);
        });
    });
    return target;
};
