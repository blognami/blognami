
import { Base } from './base.js';
import { Renderable } from './renderable.js';
import { overload  } from './overload.js';

export const Controller = Base.extend().open(Renderable);

export const defineController = overload({
    ['string, function'](name, fn){
        Controller.register(name).props({
            render(){
                return fn(this);
            }
        });
    }
});
