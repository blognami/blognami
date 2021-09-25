
import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { dasherize } from './inflector.js';
import { overload } from './overload.js';
import { thatify } from './thatify.js';

export const Command = Base.extend().include({
    meta(){
        this.include(Registrable);

        const { register } = this;

        this.assignProps({
            register(name){
                return register.call(this, dasherize(name));
            },

            run(name = 'list-commands', ...args){
                return this.create(name, ...args).run();
            }
        });
    },

    initialize(environment){
        this.environment = environment;
    },
    
    run(){
        console.error(`No such command "${this.constructor.name}" exists.`);
    },

    __getMissing(name){
        return this.environment[name];
    }
});


export const defineCommand = overload({
    ['string, object'](name, include){
        const abstract = include.abstract;
        delete include.abstract;
        Command.register(name, abstract).include(include);
    },

    ['string, function'](name, fn){
        defineCommand(name, { run: thatify(fn) });
    }
});
