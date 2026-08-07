
import { Class } from './class.js';
import { inflector } from './inflector.js';
import { AbstractImportableRegistry } from 'haberdash';
import { ServiceFactory } from './service_factory.js';
import { Workspace } from './workspace.js';

export const Job = Class.extend('Job').include({
    meta(){
        this.include(AbstractImportableRegistry);
        this.include(ServiceFactory.Consumerable);

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

            async run(name, params = {}, parentContext){
                const JobClass = this;
                await Workspace.run(async function(){
                    Object.assign(this.initialParams, params);
                    await JobClass.create(name, this.context).run();
                }, parentContext);
            },
        });
    },

    run(){
        console.error(`No such job "${this.constructor.name}" exists.`);
    }
});
