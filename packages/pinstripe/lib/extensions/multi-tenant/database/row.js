
import { Table, Row } from 'pinstripe/database';

let initializedTenantModel = false; // We shouldn't need this.

Row.include({
    meta(){
        const { loadSchema } = this;

        // this.assignProps({
        //     async loadSchema(...args){
        //         await loadSchema.call(this, ...args);

        //         if(initializedTenantModel) return;
        //         initializedTenantModel = true;
                
        //         this.register('tenant', {
        //             meta(){
        //                 Table.names.forEach(name => {
        //                     if(name == 'tenants') return;
        //                     this.hasMany(name);
        //                 });
        //             }
        //         });
        //     }
        // });

        const { initialize, update } = this.prototype;

        this.include({
            initialize(database, fields, exists){
                const columns = Table.for(this.constructor.collectionName).columns;
                if(columns.tenantId && database.tenant){
                    return initialize.call(this, database, { ...fields, tenantId: database.tenant.id }, exists);
                }
                return initialize.call(this, database, fields, exists);
            },

            update(fields){
                const columns = Table.for(this.constructor.collectionName).columns;
                if(columns.tenantId && this.database.tenant){
                    return update.call(this, { ...fields, tenantId: this.database.tenant.id });
                }
                return update.call(this, fields);
            }
        });
    }
});
