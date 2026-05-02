
import { trapify } from './trapify.js';
import { ServiceFactory } from "./service_factory.js"

export const ServiceConsumer = {
    initialize(context){
        this.context = context;
        return trapify(this);
    },

    __getMissing(target, name){
        if(ServiceFactory.mixins[name]){
            const service = ServiceFactory.create(name, this.context).create();
            const interceptor = this.context._serviceInterceptors?.[name];
            return interceptor ? interceptor(service) : service;
        }
    }
}

ServiceFactory.include(ServiceConsumer);
