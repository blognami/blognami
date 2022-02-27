
import { Base } from "../base.js";
import { Registrable } from '../registrable.js';

export const Adapter = Base.extend().include({
    meta(){
        this.include(Registrable);
    },

    initialize(config){
        this.config = config;
    }
});

export const createAdapterDeligator = namespace => name => {
    return function(...args){
        const { methods } = this._adapter;
        if(methods && methods[namespace] && methods[namespace][name]){
            return this._adapter.methods[namespace][name].call(this, ...args);
        }
        throw new Error(`Adapter method '${namespace}.${name}' does not exist.`)
    }
};