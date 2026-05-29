import { Class, AbstractServiceFactory } from 'haberdash';

export const ServiceFactory = Class.extend().include({
    meta(){
        this.include(AbstractServiceFactory);
        this.include(this.Consumerable);
    }
});
