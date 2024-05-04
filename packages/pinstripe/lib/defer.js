
export const defer = (fn, path = []) => new Proxy(() => {}, {
    get(target, name){
        if (name == 'then'){
            const out = (async () => {
                let out = await fn();
                const uncompletedPath = [ ...path ];
                while(uncompletedPath.length){
                    if(out == undefined){
                        const completedPath = path.slice(0, path.length - uncompletedPath.length);
                        throw new Error(`Can't unwrap deferred object${formatPath(path)} (object${formatPath(completedPath)} is undefined).`);
                    }
                    if(typeof uncompletedPath[0] == 'string' && Array.isArray(uncompletedPath[1])){
                        const name = uncompletedPath.shift();
                        const args = uncompletedPath.shift();
                        out = await out[name].call(out, ...args);
                    } else if(typeof uncompletedPath[0] == 'string'){
                        out = await out[uncompletedPath.shift()];
                    } else {
                        out = await out(...uncompletedPath.shift());
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
