
export class Class {

    static extend(){
        return class extends this {};
    }

    static include(...includes){
        includes.forEach(include => {
            this.prototype.assignProps(include, name => name != 'meta');
            if(typeof include.meta != 'function') return;
            include.meta.call(this);
        });
        return this;
    }

    static assignProps(...sources){
        return assignProps(this, ...sources);
    }

    static new(...args){
        return new this(...args);
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
}

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
