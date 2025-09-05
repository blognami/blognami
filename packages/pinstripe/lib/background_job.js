
import { Class } from './class.js';
import { inflector } from './inflector.js';
import { ImportableRegistry } from './importable_registry.js';
import { ServiceConsumer } from './service_consumer.js';

export const BackgroundJob = Class.extend().include({
    meta(){
        this.assignProps({ name: 'BackgroundJob' });

        this.include(ImportableRegistry);
        this.include(ServiceConsumer);

        this.assignProps({
            normalizeName(name){
                return inflector.dasherize(name);
            },

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

            async run(context, name){
                await context.fork().run(async context => {
                    await this.create(name, context).run();
                });
            },
        });
    },

    run(){
        console.error(`No such background job "${this.constructor.name}" exists.`);
    }
});
