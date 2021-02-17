

import { ServiceFactory } from './service_factory.js';
import { Base } from './base.js';

export const Environment = Base.extend().define(dsl => dsl
    .props({
        initialize(parentEnvironment){
            this._parentEnvironment = parentEnvironment;
            this._environment = this;
        }
    })
);

ServiceFactory.define(dsl => dsl
    .tap(Class => {
        const register = Class.register;
        Class.define(dsl => dsl
            .classProps({
                register(name){
                    if(!Environment.prototype.hasOwnProperty(name)){
                        const _name = `_${name}`;
                        Environment.define(dsl => dsl
                           .props({
                                get [name](){
                                    if(!this.hasOwnProperty(_name)){
                                        this[_name] = ServiceFactory.create(name, this).create();
                                    }
                                    return this[_name];
                                },

                                set [name](value){
                                    this[_name] = value;
                                }
                            })
                        );
                    }
                    return register.call(this, name);
                }
            })
        );
    })
);

Base.define(dsl => dsl
    .classProps({
        ['dsl.serviceProps'](...names){
            names.forEach(name => 
                this.define(dsl => dsl
                    .props({
                        get [name](){
                            return this._environment[name];
                        }
                    })
                )
            );
        }
    })
);