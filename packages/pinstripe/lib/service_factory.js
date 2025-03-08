
import { Class } from './class.js';
import { Inflector } from './inflector.js';
import { Registry } from './registry.js';

export const ServiceFactory = Class.extend().include({
    meta(){
        this.assignProps({ name: 'ServiceFactory' });

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
