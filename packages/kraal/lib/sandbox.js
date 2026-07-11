import { AbstractImportableRegistry } from 'haberdash';
import { Annotatable } from 'haberdash';
import { Class } from 'haberdash';
import { ServiceFactory } from './service_factory.js';

export const Sandbox = Class.extend('Sandbox').include({
    meta(){
        this.include(AbstractImportableRegistry);
        this.include(Annotatable);
        this.include(ServiceFactory.Consumerable);
    }
});
