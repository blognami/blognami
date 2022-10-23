
export const assignProps = (target, ...sources) => {
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
