
import { Registrable } from './registrable.js';

export const Renderable = Class => (Class
    .include(Registrable)
    .staticProps({
        render(...args){
            return this.create(...args).render();
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
