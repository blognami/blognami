
import { Workspace, BackgroundJob } from 'pinstripe';

export default {
    async queueBackgroundJob(name, params){
        const { multiTenant = true, tenantsFilter = tenants => tenants } = BackgroundJob.for(name);
        const backgroundJobQueue = this.backgroundJobQueue;

        if(multiTenant){
            await Workspace.run(async function(){
                if(!await this.database.info.tenants) return;
                for(let tenant of await tenantsFilter(this.database.tenants).all()){
                    await backgroundJobQueue.push(name, {
                        ...params,
                        _headers: { 'x-tenant-id': tenant.id }
                    });
                }
            });
        } else {
            await backgroundJobQueue.push(name, params);
        }
    }
};
