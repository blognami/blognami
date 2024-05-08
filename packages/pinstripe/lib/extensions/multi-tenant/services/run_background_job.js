
import { BackgroundJob } from '../../../background_job.js';
import { Workspace } from '../../../workspace.js';

export default {
    create(){
        return (...args) => this.runBackgroundJob(this.context, ...args);
    },

    async runBackgroundJob(name, ...args){
        const { multiTenant = true, tenantsFilter = tenants => tenants } = BackgroundJob.for(name);

        if(multiTenant){
            await Workspace.run(async function(){
                if(!await this.database.info.tenants) return;
                for(let tenant of await tenantsFilter(this.database.tenants).all()){
                    await Workspace.run(async function(){
                        this.initialParams._headers['x-tenant-id'] = tenant.id;
                        await BackgroundJob.run(this.context, ...args);
                    });
                }
            });
        } else {
            await BackgroundJob.run(this.context, ...args);
        }
    }
};
