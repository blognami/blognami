
import { Base } from './base.js';
import { Renderable } from './renderable.js';
import { overload  } from './overload.js';
import { thatify } from './thatify.js';

export const Controller = Base.extend().open(Renderable);

export const defineController = overload({
    ['string, object'](name, include){
        Controller.register(name).include(include);
    },

    ['string, function'](name, fn){
        defineController(name, { render: thatify(fn) });
    }
});
