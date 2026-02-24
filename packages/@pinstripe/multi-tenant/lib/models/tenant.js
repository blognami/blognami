
import { Table } from "@pinstripe/database";
import { Workspace } from 'pinstripe';

export default {
    meta(){
        this.include('untenantable');

        this.hasMany('hosts');

        this.addHook('beforeDelete', async function(){
            await this.runInNewWorkspace(async function(){
                for(const tableName of Table.names){
                    if(Table.for(tableName).untenantable) continue;
                    await this.database[tableName].delete();
                }
            });
        });
    },

    runInNewWorkspace(fn){
        const tenantId = this.id;
        const client = this.database.client.clone();
        return Workspace.run(function(){
            this.initialParams._headers['x-tenant-id'] = tenantId;
            this.context.root.databaseClient = client;
            return fn.call(this, this);
        });
    }
};
