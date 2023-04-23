
import { Class } from './class.js';
import { inflector } from './inflector.js';
import { Registry } from './registry.js';
import { ServiceConsumer } from './service_consumer.js';

export const Command = Class.extend().include({
    meta(){
        this.include(Registry);
        this.include(ServiceConsumer);

        this.assignProps({
            normalizeName: (...args) => inflector.dasherize(...args),

            get schedules(){
                if(!this.hasOwnProperty('_schedules')){
                    this._schedules = [];
                }
                return this._schedules;
            },

            schedule(...args){
                this.schedules.push(args);
                return this;
            },

            async run(context, name = 'list-commands', ...args){
                return context.fork().run(async context => {
                    context.args = [ ...args ];
                    await this.create(name, context).run();
                });
            },
        });
    },

    run(){
        console.error(`No such command "${this.constructor.name}" exists.`);
    }
});
