
import { Base } from './base.js';

export const AsyncPathBuilder = Base.extend().include({
    initialize(startObject, path = []){
        this._startObject = startObject;
        this._path = path;
    },

    __getMissing(name){
        return new this.constructor(this._startObject, [...this._path, name ]);
    },

    __call(...args){
        return new this.constructor(this._startObject, [...this._path, args ]);
    },

    get toString(){
        return this.__getMissing('toString');
    },

    then(...args){
        return unwrap(this._startObject, [...this._path]).then(...args);
    }
});

const unwrap = async (startObject, path) => {
    let out = await startObject;
    let originalPath = [ ...path ];
    while(path.length){
        if(out == undefined){
            const completedPath = originalPath.slice(0, originalPath.length - path.length);
            throw new Error(`Can't unwrap object${formatPath(originalPath)} (object${formatPath(completedPath)} is undefined)`);
        }
        if(typeof path[0] == 'string'){
            const name = path.shift();
            if(Array.isArray(path[0])){
                const args = path.shift();
                if(typeof out[name] != 'function'){
                    out = await out[name];
                    path.unshift(args);
                } else {
                    out = await out[name](...args);
                }    
            } else {
                out = await out[name];
            }
        } else {
            const args = path.shift();
            out = await out(...args);
        }
    }
    return out;
};

const formatPath = path => path.map(segment => typeof segment == 'string' ? `.${segment}` : '(...)').join('')