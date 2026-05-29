
export class Class {

    static extend(name){
        const cls = class extends this {};
        if(name !== undefined) cls.assignProps({ name });
        return cls;
    }

    static include(...includes){
        includes.forEach(include => {
            if(typeof include.meta == 'function') include.meta.call(this);
            this.prototype.assignProps(include, name => name != 'meta');
        });
        return this;
    }

    static assignProps(...sources){
        return assignProps(this, ...sources);
    }

    static bindProps(names){
        return bindProps(this, names);
    }

    static new(...args){
        return new this(...args);
    }

    static get parent(){
        return this.__proto__;
    }

    constructor(...args){
        let out = this.initialize(...args);
        if(typeof out?.then == 'function'){
            return out.then(out => out || this);
        }
        return out || this;
    }

    initialize(){

    }

    assignProps(...sources){
        return assignProps(this, ...sources);
    }

    bindProps(names){
        return bindProps(this, names);
    }
}

const bindProps = (target, names) => Object.fromEntries(names.map(name => [name, target[name].bind(target)]));

const assignProps = (target, ...sources) => {
    const fn = typeof sources[sources.length - 1] == 'function' ?  sources.pop() :  () => true;

    sources.forEach(source => {
        Object.getOwnPropertyNames(source).forEach(name => {
            if(!fn(name)){
                return;
            }
            const descriptor = { ...Object.getOwnPropertyDescriptor(source, name) };
            const { get: targetGet, set: targetSet } = (Object.getOwnPropertyDescriptor(target, name) || {});
            const { get = targetGet, set = targetSet } = descriptor;

            if(get) descriptor.get = get;
            if(set) descriptor.set = set;

            Object.defineProperty(target, name, descriptor);
        });
    });
    return target;
};
