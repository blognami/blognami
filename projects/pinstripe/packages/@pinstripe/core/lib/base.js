
export class Base {

    static ['dsl.tap'](fn){
        fn.call(this, this);
    }

    static ['dsl.classProps'](...args){
        assignProps(this, ...args);
    }

    static ['dsl.props'](...args){
        assignProps(this.prototype, ...args);
    }

    static ['dsl.include'](...args){
        this.define(...args);
    }

    static new(...args){
        return new this(...args);
    }

    static extend(){
        return class extends this {};
    }
    
    static define(...fns){
        fns.forEach(fn => fn(extractDsl(this)));
        return this;
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

    get __proxy(){
        let out = this;

        const traps = {};

        const isGetMissingMethod = typeof this.__getMissing == 'function';
        const isSetMissingMethod = typeof this.__setMissing == 'function';
        const isCallMethod = typeof this.__call == 'function';

        if(isGetMissingMethod || isCallMethod){
            traps.get = (target, name) => {
                if(getAllProps(this).includes(name)){
                    return this[name];
                }
                if(isGetMissingMethod && name != 'then'){
                    return this.__proxy.__getMissing(name);
                }
            };
        }
        if(isSetMissingMethod || isCallMethod){
            traps.set = (target, name, value) => {
                if(getAllProps(this).includes(name)){
                    this[name] = value;
                } else if(isSetMissingMethod){
                    this.__setMissing(name, value);
                }
                return true;
            };
        }
        if(isCallMethod){
            out = () => {};
            traps.apply = (target, thisArg, args) => {
                return this.__call(...args);
            };
        }

        if(Object.keys(traps).length){
            // traps.getPrototypeOf = () => this.__proto__;
            out = new Proxy(out, traps);
        }
    
        return out;
    }

    get __this(){
        return this;
    }
    
};

const assignProps = (target, ...sources) => {
    sources.forEach(source => {
        Object.getOwnPropertyNames(source).forEach(name => {
            Object.defineProperty(target, name, Object.getOwnPropertyDescriptor(source, name));
        });
    });
    return target;
};

const extractDsl = (Class, prepare = true) => {
    const out = {};

    Object.getOwnPropertyNames(Class).forEach((propertyName) => {
        const matches = propertyName.match(/^dsl\.(.*)$/, propertyName);
        if(matches && typeof Class[propertyName] == 'function'){
            out[matches[1]] = Class[propertyName];
        }
    });

    if(Class.__proto__){
        Object.assign(out, extractDsl(Class.__proto__, false));
    }

    if(prepare){
        Object.keys(out).forEach(key => {
            const fn = out[key].bind(Class);
            out[key] = (...args) => {
                fn(...args);
                return extractDsl(Class);
            };
        })
    }

    return out;
};

const getAllProps = (o, out = []) => {
    Object.getOwnPropertyNames(o).forEach(name => {
        if(!out.includes(name)){
            out.push(name);
        }
    });
    if(o.__proto__){
        getAllProps(o.__proto__, out);
    }
    return out;
};
