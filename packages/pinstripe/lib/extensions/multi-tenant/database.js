
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
                    this.tenant = await (await out.tenants.tap(function(){
                        this.where('(? = ? or ? = ?)', this.tableReference.createColumnReference('name'), name, this.tableReference.createColumnReference('host'), host);
                    })).first();
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
