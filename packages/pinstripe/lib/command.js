
import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { dasherize } from './inflector.js';
import { overload } from './overload.js';

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
        },

        define(name, fn){
            return this.register(name).props({
                run(){
                    return fn(this);
                }
            });
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
    ['string, function'](name, fn){
        Command.register(name).props({
            run(){
                return fn(this);
            }
        });
    }
});
