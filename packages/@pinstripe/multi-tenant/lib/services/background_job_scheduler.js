
import { Workspace, BackgroundJob } from 'pinstripe';

export default {
    async queueBackgroundJob(name, params){
        const { tenantScopes } = BackgroundJob.for(name);

        await Workspace.run(async function(){
            if(!await this.database.info.tenants) return;

            let tenants = this.database.tenants;
            for(const scope of tenantScopes){
                tenants = tenants.where(scope);
            }

            for(let tenant of await tenants.all()){
                await this.backgroundJobQueue.push(name, {
                    ...params,
                    _headers: { ...(params._headers || {}), 'x-tenant-id': tenant.id }
                });
            }
        });
    }
};
