
import { Class } from './class.js';
import { inflector } from './inflector.js';
import { ImportableRegistry } from './importable_registry.js';
import { ServiceConsumer } from './service_consumer.js';
import { Workspace } from './workspace.js';

export const Job = Class.extend().include({
    meta(){
        this.assignProps({ name: 'Job' });

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

            schedule(crontab, params = {}){
                this.schedules.push({ crontab, params });
                return this;
            },

            async run(name, params = {}){
                const JobClass = this;
                await Workspace.run(async function(){
                    Object.assign(this.initialParams, params);
                    await JobClass.create(name, this.context).run();
                });
            },
        });
    },

    run(){
        console.error(`No such job "${this.constructor.name}" exists.`);
    }
});
