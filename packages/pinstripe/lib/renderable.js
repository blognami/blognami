
import { Registrable } from './registrable.js';

export const Renderable = {
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
};
