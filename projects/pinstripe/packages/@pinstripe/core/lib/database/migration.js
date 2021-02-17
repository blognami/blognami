

import { Base } from '../base.js';
import { Registrable } from '../registrable.js';

export const Migration = Base.extend().define(dsl => dsl
    .include(Registrable)
    .tap(Class => {
        const register = Class.register;
        Class.define(dsl => dsl
            .classProps({
                register(name){
                    if(!name.match(/^\d+/)){
                        throw `Invalid migration name '${name}' - it must begin with a unix timestamp`
                    }
                    return register.call(this, name);
                }
            })
        );
    })
    .classProps({
        get schemaVersion(){
            const matches = this.name.match(/^\d+/)
            if(matches){
                return parseInt(matches[0]);
            }
            return 0;
        }
    })
    .props({
        initialize(environment){
            this._environment = environment;
        },

        migrate(){

        }
    })
);

export const migration = (name, fn) => {
    Migration.register(name).define(dsl => dsl
        .serviceProps('environment')
        .props({
            migrate(){
                return fn(this.environment);
            }
        })
    );
};

