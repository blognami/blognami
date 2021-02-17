
import { Base } from './base.js'
import { Registrable } from './registrable.js';

export const View = Base.extend().define(dsl => dsl
    .include(Registrable)
    .props({
        initialize(environment){
            this._environment = environment;
        },
        
        get name(){
            return this.constructor.name;
        },

        render(){
            
        }
    })
);

export const view = (name, fn) => {
    View.register(name).define(dsl => dsl
        .serviceProps('environment')
        .props({
            render(){
                return fn(this.environment);
            }
        })
    );
};
