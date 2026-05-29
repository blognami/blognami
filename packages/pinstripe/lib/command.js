
import { Class } from './class.js';
import { AbstractCommand } from 'haberdash';
import { ServiceFactory } from './service_factory.js';

export const Command = Class.extend('Command').include({
    meta(){
        this.include(AbstractCommand);
        this.include(ServiceFactory.Consumerable);
    }
});

Command.binaryName = 'pinstripe';
