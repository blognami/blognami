
import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { AsyncPathBuilder } from './async_path_builder.js';
import { camelize } from './inflector.js';
import { overload } from './overload.js';
import { thatify } from './thatify.js';

export const ServiceFactory = Base.extend().include({
    meta(){
        this.include(Registrable);

        const { register, create } = this;

        this.assignProps({
            register(name){
                return register.call(this, camelize(name));
            },

            scope: 'current',

            create(name, { parentEnvironment, environment }){
                if(this.for(name).scope == 'root' && parentEnvironment !== undefined){
                    return parentEnvironment[name];
                } else {
                    const instance = create.call(this, name, environment).create();
                    if(instance != undefined && typeof instance.then == 'function'){
                        return AsyncPathBuilder.new(instance);
                    }
                    return instance;
                }
            }
        });
    },

    initialize(environment){
        this.environment = environment;
    },
    
    create(){
        return this;
    },

    __getMissing(name){
        return this.environment[name];
    }
});

export const defineService = overload({
    ['string, object'](name, include){
        const abstract = include.abstract;
        delete include.abstract;
        ServiceFactory.register(name, abstract).include(include);
    },

    ['string, function'](name, fn){
        defineService(name, { create: thatify(fn) });
    }
});
