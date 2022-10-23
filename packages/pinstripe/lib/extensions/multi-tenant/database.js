
import { Database } from '../../database.js';

Database.include({
    meta(){
        const { initialize } =  this.prototype;

        this.include({
            async initialize(...args){
                const out = await initialize.call(this, ...args);
                const { tenant } = this.options;
                if(tenant && out.info.tenants){
                    const { name, host } = tenant;
                    if(name) {
                        this.tenant = await out.tenants.where({ name }).first();
                    } else {
                        this.tenant = await out.tenants.where({ host }).first();
                    }
                }
                return out;
            },

            get withoutTenantScope(){
                const { tenant, ...options } = this.options;
                return Database.new(this.client, options);
            }
        });
    }
});
