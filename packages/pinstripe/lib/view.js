

import { Base } from './base.js';
import { Renderable } from './renderable.js';
import { overload } from './overload.js';

export const View = Base.extend().open(Renderable);

export const defineView = overload({
    ['string, function'](name, fn){
        View.register(name).props({
            render(){
                return fn(this);
            }
        });
    }
});
