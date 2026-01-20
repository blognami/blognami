
import { Workspace, Job } from 'pinstripe';

export default {
    async queueJob(name, params){
        const { tenantScopes } = Job.for(name);

        await Workspace.run(async function(){
            if(!await this.database.info.tenants) return;

            let tenants = this.database.tenants;
            for(const scope of tenantScopes){
                tenants = tenants.where(scope);
            }

            for(let tenant of await tenants.all()){
                await this.jobQueue.push(name, {
                    ...params,
                    _headers: { ...(params._headers || {}), 'x-tenant-id': tenant.id }
                });
            }
        });
    }
};
