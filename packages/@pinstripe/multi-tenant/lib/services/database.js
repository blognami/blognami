
import { Database, Client } from "@pinstripe/database";

export default {
    create(){
        return this.defer(async () => {
            this.database = this.defer(async () => Database.new(
                await this.context.root.getOrCreate("databaseClient", async () =>
                    Client.new(await this.config.database)
                ),
                this.context
            ));

            if(await this.database.info.tenants){
                let { tenant = defaultCallback } = await this.config;

                const tenantId = this.initialParams._headers['x-tenant-id'];
                if(tenantId) tenant = await this.database.tenants.where({ id: tenantId }).first();
                
                if(typeof tenant == 'function') tenant = await tenant.call(this);

                if(typeof tenant == 'string') tenant = await this.database.tenants.where({ hosts: { name: tenant } }).first();
                
                if(tenant) {
                    this.database = await this.database;
                    this.database.tenant = tenant;
                }
            }

            return this.database;
        });
    }
};

async function defaultCallback(){
    const headers = this.initialParams._headers;
    const hostname = this.initialParams._url.hostname;
    const host = (headers['host'] || hostname).replace(/\:\d+$/, '').toLowerCase();

    return this.database.withoutTenantScope.tenants.where({
        hosts: { name: host, type: ['internal', 'verified'] }
    }).first();
}
