
import { Table } from '@pinstripe/database';

Table.include({
    meta(){
        const { create, initialize } = this.prototype;

        this.include({
            async create(...args){
                if(this.exists) return;
                await create.call(this, ...args);
                if(Table.for(this.constructor.name).untenantable) return;
                await this.addColumn('tenantId', 'foreign_key');
            },
            
            initialize(...args){
                const out = initialize.call(this, ...args);
                if(this.constructor.columns.tenantId && this.database.scopedByTenant){
                    if(this.database.tenant){
                        this.where({ tenantId: this.database.tenant.id });
                    } else {
                        this.where('1 = 2')
                    }
                }
                return out;
            }
        });
    }
});
