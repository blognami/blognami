
import { BackgroundJob } from 'sintra';
import { Workspace } from 'sintra';

export default {
    create(){
        return name => this.runBackgroundJob(name);
    },

    async runBackgroundJob(name){
        const { multiTenant = true, tenantsFilter = tenants => tenants } = BackgroundJob.for(name);

        if(multiTenant){
            await Workspace.run(async function(){
                if(!await this.database.info.tenants) return;
                for(let tenant of await tenantsFilter(this.database.tenants).all()){
                    await Workspace.run(async function(){
                        this.initialParams._headers['x-tenant-id'] = tenant.id;
                        await BackgroundJob.run(this.context, name);
                    });
                }
            });
        } else {
            await BackgroundJob.run(this.context, name);
        }
    }
};
