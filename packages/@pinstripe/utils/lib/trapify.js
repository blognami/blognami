

const TRAP_NAMES = ['get', 'set', 'deleteProperty' ,'ownKeys' ,'has' ,'apply' ,'defineProperty' ,'getPrototypeOf' ,'setPrototypeOf' ,'isExtensible' ,'preventExtensions' ,'getOwnPropertyDescriptor' ,'enumerate' ,'construct'];

export const trapify = o => new Proxy(new Proxy(o, {
    get(target, name, ...args){
        const descriptor = getPropertyDescriptor(target, name);
        if(descriptor){
            const { get, value } = descriptor;
            if(get) return get.call(trapify(target));
            return value;
        }
        if(getPropertyDescriptor(target, '__getMissing')) return target.__getMissing.call(trapify(target), target, name, ...args);
    },
    
    set(target, name, value, ...args){
        const descriptor = getPropertyDescriptor(target, name);
        if(descriptor){
            const { set } = descriptor;
            if(set) return set.call(trapify(target), value);
        }
        if(getPropertyDescriptor(target, '__setMissing')) return target.__setMissing.call(trapify(target), target, name, value, ...args);
        target[name] = value;
        return true;
    }
}), TRAP_NAMES.reduce((traps, name) => {
    const methodName = `__${name}`;
    if(getPropertyDescriptor(o, methodName)) traps[name] = (target, ...args) => target[methodName].call(trapify(target), target, ...args);
    return traps;
}, {}));

const getPropertyDescriptor = (o, name) => o ? Object.getOwnPropertyDescriptor(o, name) || getPropertyDescriptor(Object.getPrototypeOf(o), name) : undefined;
