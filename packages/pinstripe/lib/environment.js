
import { Base } from './base.js';
import { ServiceFactory } from './service_factory.js';
import { overload  } from './overload.js';
import { initializeImports } from './import_all.js'; // pinstripe-if-client: export const initializeImports = () => {};

export const Environment = Base.extend().include({
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
});

export const createEnvironment = overload({
    async function(fn){
        const { environment, resetEnvironment } = await createEnvironment();
        const out = await fn(environment);
        await resetEnvironment();
        return out;
    },

    async ''(){
        await initializeImports();
        return Environment.new();
    }
})