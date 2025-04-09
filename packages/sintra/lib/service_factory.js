
import { Class } from './class.js';
import { Inflector } from './inflector.js';
import { ImportableRegistry } from './importable_registry.js';

export const ServiceFactory = Class.extend().include({
    meta(){
        this.assignProps({ name: 'ServiceFactory' });

        this.include(ImportableRegistry);

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
