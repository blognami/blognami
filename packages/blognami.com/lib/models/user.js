
import { defer } from '@pinstripe/utils';

export default {
    get portalUser(){
        return defer(async () => {
            const database = await this.database.withoutTenantScope;
            const portal = await database.tenants.where({ name: 'portal' }).first();
            const email = this.email;
            const name = this.name;
            return portal.runInNewWorkspace(async function(){
                let user = await this.database.users.where({ email }).first();
                if(!user){
                    user = await this.database.users.insert({
                        name,
                        email,
                        role: 'user'
                    });
                }
                return user;
            });
        });
    }
};
