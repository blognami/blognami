
import { Class } from './class.js';
import { AbstractServiceFactory } from 'haberdash';

export const ServiceFactory = Class.extend('ServiceFactory').include({
    meta(){
        this.include(AbstractServiceFactory);
        this.include(this.Consumerable);

        this.assignProps({
            addToClient(){
                this._addToClient = true;
            }
        });
    },

    create(){
        // by default do nothing
    }
});
