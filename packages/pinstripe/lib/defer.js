
export const defer = (fn, path = []) => new Proxy(() => {}, {
    get(target, name){
        if (name == 'then'){
            const out = (async () => {
                let out = await fn();
                let originalPath = [ ...path ];
                while(path.length){
                    if(out == undefined){
                        const completedPath = originalPath.slice(0, originalPath.length - path.length);
                        throw new Error(`Can't unwrap deferred object${formatPath(originalPath)} (object${formatPath(completedPath)} is undefined).`);
                    }
                    if(typeof path[0] == 'string' && Array.isArray(path[1])){
                        const name = path.shift();
                        const args = path.shift();
                        out = await out[name].call(out, ...args);
                    } else if(typeof path[0] == 'string'){
                        out = await out[path.shift()];
                    } else {
                        out = await out(...path.shift());
                    }
                }
                return out;
            })();
            return out.then.bind(out);
        }
        return defer(fn, [ ...path, name ]);
    },

    apply(target, thisArg, args){
        return defer(fn, [ ...path, args ]);
    }
});

const formatPath = path => path.map(segment => typeof segment == 'string' ? `.${segment}` : '(...)').join('');
