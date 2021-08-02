
import { Registrable } from './registrable.js';

export const Renderable = Class => (Class
    .include(Registrable)
    .staticProps({
        render(...args){
            return this.create(...args).render();
        },

        define(name, fn){
            return this.register(name).props({
                render(){
                    return fn(this);
                }
            });
        }
    })
    .props({
        initialize(environment){
            this.environment = environment;
        },

        render(){
            
        },

        __getMissing(name){
            return this.environment[name];
        }
    })
);
