
import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { dasherize } from './inflector.js';
import { overload } from './overload.js';
import { thatify } from './thatify.js';

export const Command = Base.extend().open(Class => Class
    .include(Registrable)
    .open(Class => {
        const { register } = Class;
        Class.staticProps({
            register(name){
                return register.call(this, dasherize(name));
            }
        });
    })
    .staticProps({
        run(name = 'list-commands', ...args){
            return this.create(name, ...args).run();
        }
    })
    .props({
        initialize(environment){
            this.environment = environment;
        },
        
        run(){
            console.error(`No such command "${this.constructor.name}" exists.`);
        },

        __getMissing(name){
            return this.environment[name];
        }
    })
);


export const defineCommand = overload({
    ['string, object'](name, include){
        Command.register(name).include(include);
    },

    ['string, function'](name, fn){
        defineCommand(name, { run: thatify(fn) });
    }
});
