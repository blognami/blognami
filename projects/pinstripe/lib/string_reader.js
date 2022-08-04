
import { Base } from './base.js';

export const StringReader = Base.extend().include({
    initialize(string){
        this.string = (string || '').toString();
    },

    get length(){
        return this.string.length
    },

    toString(){
        return this.string
    },

    match(...args){
        const out = this.string.match(...args)
        if(out){
            this.string = this.string.substr(out[0].length)
        }
        return out
    }
});
