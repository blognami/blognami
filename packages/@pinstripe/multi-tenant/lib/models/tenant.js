
import { Row } from "@pinstripe/database";
import { Workspace } from 'pinstripe';

export default {
    meta(){
        this.include('untenantable');

        Row.names.sort().forEach(name => {
            if(name == 'tenant' || Row.for(name).untenantable) return;
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
