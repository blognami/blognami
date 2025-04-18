
import { Database, Client } from "@sintra/database";

export default {
    create(){
        return this.defer(async () => {
            if(!this.context.root.databaseClient){
                this.context.root.databaseClient = Client.new(await this.config.database);
            }

            this.database = await Database.new(this.context.root.databaseClient);

            if(this.database.info.tenants){
                let { tenant = defaultCallback } = await this.config;

                const tenantId = this.initialParams._headers['x-tenant-id'];
                if(tenantId) tenant = await this.database.tenants.where({ id: tenantId }).first();
                
                if(typeof tenant == 'function') tenant = await tenant.call(this);

                if(typeof tenant == 'string') tenant = await this.database.tenants.where({ name: tenant }).first();
                
                if(tenant) this.database.tenant = tenant;
            }

            return this.database;
        });
    }
};

function defaultCallback(){
    const headers = this.initialParams._headers;
    const hostname = this.initialParams._url.hostname;
    const host = (headers['host'] || hostname).replace(/\:\d+$/, '').toLowerCase();
    return this.database.tenants.where({ host }).first();
}
