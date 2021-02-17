
import { Base } from './base.js';
import { Registrable } from './registrable.js';

export const ServiceFactory = Base.extend().define(dsl => dsl
    .include(Registrable)
    .props({
        initialize(environment){
            this._environment = environment;
        },

        create(){

        }
    })
);

export const serviceFactory = (name, fn) => {
    ServiceFactory.register(name).define(dsl => dsl
        .serviceProps('environment')
        .props({
            create(){
                return fn(this.environment);
            }
        })
    );
};
