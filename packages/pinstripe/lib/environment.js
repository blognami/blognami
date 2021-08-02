
import { Base } from './base.js';
import { ServiceFactory } from './service_factory.js';
import { overload  } from './overload.js';

export const Environment = Base.extend().open(Class => Class
    .props({
        initialize(parentEnvironment){
            this.environment = this.__proxy;
            this.parentEnvironment = parentEnvironment;
            this._instances = {};
        },

        __getMissing(name){
            if(!this._instances.hasOwnProperty(name)){
                this._instances[name] = ServiceFactory.create(name, this);
            }
            return this._instances[name];
        },

        __setMissing(name, value){
            this._instances[name] = value;
        }
    })
);

export const createEnvironment = overload({
    async function(fn){
        const { environment, resetEnvironment } = Environment.new();
        const out = await fn(environment);
        await resetEnvironment();
        return out;
    },

    ''(){
        return Environment.new();
    }
})