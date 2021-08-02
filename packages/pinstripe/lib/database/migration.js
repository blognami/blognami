

import { Base } from '../base.js';
import { Registrable } from '../registrable.js';
import { overload } from '../overload.js';

export const Migration = Base.extend().open(Class => Class
    .include(Registrable)
    .open(Class => {
        const register = Class.register;
        Class.open(Class => Class
            .staticProps({
                register(name){
                    if(!name.match(/^\d+/)){
                        throw new Error(`Invalid migration name '${name}' - it must begin with a unix timestamp`);
                    }
                    return register.call(this, name);
                }
            })
        );
    })
    .staticProps({
        get schemaVersion(){
            const matches = this.name.match(/^\d+/)
            if(matches){
                return parseInt(matches[0]);
            }
            return 0;
        },

        define(name, fn){
            return this.register(name).props({
                migrate(){
                    return fn(this);
                }
            });
        }
    })
    .props({
        initialize(environment){
            this.environment = environment;
        },

        migrate(){
            
        },

        __getMissing(name){
            return this.environment[name];
        }
    })
);

export const defineMigration = overload({
    ['string, function'](name, fn){
        Migration.register(name).props({
            migrate(){
                return fn(this);
            }
        });
    }
});
