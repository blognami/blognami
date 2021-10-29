

import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { overload } from './overload.js';
import { thatify } from './thatify.js';

export const View = Base.extend().include({
    meta(){
        this.include(Registrable)
        this.assignProps({
            render(...args){
                return this.create(...args).render();
            }
        });
    },

    initialize(environment){
        this.environment = environment;
    },

    render(){
        
    },

    __getMissing(name){
        return this.environment[name];
    }
});

export const defineView = overload({
    ['string, object'](name, include){
        const abstract = include.abstract;
        delete include.abstract;
        View.register(name, abstract).include(include);
    },

    ['string, function'](name, fn){
        defineView(name, { render: thatify(fn) });
    }
});
