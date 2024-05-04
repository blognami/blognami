
import { Workspace } from '../../../workspace.js';

export default {
    async runCommand(name, ...args){
        await Workspace.run(async function(){
            if(!await this.database.info.tenants) return;

            const { tenantsFilter = tenants => tenants } = typeof args[args.length - 1] == 'object' ? args.pop() : {};

            for(let tenant of await tenantsFilter(this.database.tenants).all()){
                await Workspace.run(async function(){
                    this.initialParams._headers['x-tenant-id'] = tenant.id;
                    await this.runCommand(name, ...args);
                });
            }
        });
    }
}
