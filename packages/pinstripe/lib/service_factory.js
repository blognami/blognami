
import { Class } from './class.js';
import { Registry } from './registry.js';
import { Inflector } from './inflector.js'

export const ServiceFactory = Class.extend().include({
    meta(){
        this.include(Registry);

        this.assignProps({
            normalizeName(name){
                return Inflector.instance.camelize(name);
            }
        });
    },

    create(){
        // by default do nothing
    }
});
