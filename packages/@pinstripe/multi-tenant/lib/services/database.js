
import { Database, Client } from "@pinstripe/database";

export default {
    create(){
        return this.defer(async () => {
            this.database = await Database.new(
                await this.context.root.getOrCreate("databaseClient", async () =>
                    Client.new(await this.config.database)
                ),
                this.context
            );

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
