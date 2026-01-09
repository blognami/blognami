
import { Row } from "@pinstripe/database";
import { Workspace } from 'pinstripe';

export default {
    meta(){
        Row.names.sort().forEach(name => {
            if(name == 'tenant' || name == 'appliedMigration') return;
            const { collectionName, abstract } = Row.for(name);
            this.hasMany(collectionName, { cascadeDelete: !abstract });
        });

        this.hasMany('tenants', { cascadeDelete: false });
    },

    runInNewWorkspace(fn){
        const tenantId = this.id;
        return Workspace.run(function(){
            this.initialParams._headers['x-tenant-id'] = tenantId;
            return fn.call(this, this);
        });
    }
};
