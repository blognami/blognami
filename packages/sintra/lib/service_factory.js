
import { Class, Inflector, Registry } from 'haberdash';

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
