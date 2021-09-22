

import { Base } from './base.js';
import { Renderable } from './renderable.js';
import { overload } from './overload.js';
import { thatify } from './thatify.js';

export const View = Base.extend().include(Renderable);

export const defineView = overload({
    ['string, object'](name, include){
        View.register(name).include(include);
    },

    ['string, function'](name, fn){
        defineView(name, { render: thatify(fn) });
    }
});
