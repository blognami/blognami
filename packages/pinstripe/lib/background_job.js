
import { Class } from './class.js';
import { inflector } from './inflector.js';
import { ImportableRegistry } from './importable_registry.js';
import { ServiceConsumer } from './service_consumer.js';
import { Workspace } from './workspace.js';

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

            async run(name, params = {}){
                const BackgroundJobClass = this;
                await Workspace.run(async function(){
                    Object.assign(this.initialParams, params);
                    await BackgroundJobClass.create(name, this.context).run();
                });
            },
        });
    },

    run(){
        console.error(`No such background job "${this.constructor.name}" exists.`);
    }
});
