
import { Base } from './base.js';

export const PathBuilder = Base.extend().define(dsl => dsl
    .props({
        initialize(startObject, path = []){
            this._startObject = startObject;
            this._path = path;
        },

        __getMissing(name){
            return new this.constructor(this._startObject, [...this._path, [ name ]]);
        },

        __call(...args){
            const path = [...this._path];
            path.push([...path.pop(), ...args]);
            const name = path[path.length - 1][0];
        
            return new this.constructor(this._startObject, path);
        },

        then(...args){
            return unwrap(this._startObject, this._path).then(...args);
        },

        async log(){
            try {
                console.log(
                    await unwrap(this._startObject, this._path)
                );
            } catch (e) {
                console.error(e);
            }
        }
    })
);

async function unwrap(startObject, path) {
    let out = await startObject;
    while(path.length){
        const [ name, ...args ] = path.shift();
        if(typeof out[name] == 'function'){
            out = await out[name](...args);
        } else {
            out = await out[name];
            if(typeof out == 'function'){
                out = await out(...args);
            }
        }
    }
    return out;
}