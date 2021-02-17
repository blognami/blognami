
import { Base } from './base.js';
import { Registrable } from './registrable.js';

export const Command = Base.extend().define(dsl => dsl
    .include(Registrable)
    .props({
        initialize(environment){
            this._environment = environment;
        },
        
        run(){
            console.error(`No such command "${this.constructor.name}" exists.`);
        }
    })
);

export const command = (name, fn) => {
    Command.register(name).define(dsl => dsl
        .serviceProps('environment')
        .props({
            run(){
                return fn(this.environment);
            }
        })
    );
};
