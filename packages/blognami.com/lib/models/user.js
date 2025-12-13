
import { defer } from '@pinstripe/utils';

export default {
    get portalUser(){
        return defer(async () => {
            const database = await this.database.withoutTenantScope;
            const portal = await database.tenants.where({ name: 'portal' }).first();
            const portalDatabase = await portal.scopedDatabase;
            let user = await portalDatabase.users.where({ email: this.email }).first();
            if(!user){
                user = await portalDatabase.users.insert({
                    name: this.name,
                    email: this.email,
                    role: 'user'
                });
            }
            return user;
        });
    }
};
