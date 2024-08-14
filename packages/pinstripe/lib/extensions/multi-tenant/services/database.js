
import { Database, Client } from "pinstripe/database";

export default {
    create(){
        return this.defer(async () => {
            if(!this.context.root.databaseClient){
                this.context.root.databaseClient = Client.new(await this.config.database);
            }

            const out = await Database.new(this.context.root.databaseClient);

            if(out.info.tenants){
                const headers = this.initialParams._headers;
                const hostname = this.initialParams._url.hostname;
                const host = (headers['host'] || hostname).replace(/\:\d+$/, '').toLowerCase();
                const { primaryDomain = '' } = await this.config;
                const domainSuffix = `\.${primaryDomain}`.toLowerCase();
                const tenantId = headers['x-tenant-id'];

                if(tenantId){
                    out.tenant = await out.tenants.where({ id: tenantId }).first();
                } else if(host.endsWith(domainSuffix)){
                    const name = host.substr(0, host.length - domainSuffix.length);
                    out.tenant = await out.tenants.where({ name }).first();
                } else {
                    out.tenant = await out.tenants.where({ host }).first();
                }
            }

            return out;
        });
    }
};
