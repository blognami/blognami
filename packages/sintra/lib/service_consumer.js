
import { trapify } from 'haberdash';
import { ServiceFactory } from "./service_factory.js"

export const ServiceConsumer = {
    initialize(context){
        this.context = context;
        return trapify(this);
    },

    __getMissing(target, name){
        if(ServiceFactory.mixins[name]) return ServiceFactory.create(name, this.context).create();
    }
}

ServiceFactory.include(ServiceConsumer);
