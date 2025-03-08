
import { Table, Row } from 'pinstripe/database';

Row.include({
    meta(){
        const { initialize, update } = this.prototype;

        this.include({
            initialize(database, fields, ...args){
                const columns = Table.for(this.constructor.collectionName).columns;
                if(columns.tenantId && database.tenant){
                    return initialize.call(this, database, { ...fields, tenantId: database.tenant.id }, ...args);
                }
                return initialize.call(this, database, fields, ...args);
            },

            update(fields, ...args){
                const columns = Table.for(this.constructor.collectionName).columns;
                if(columns.tenantId && this.database.tenant){
                    return update.call(this, { ...fields, tenantId: this.database.tenant.id }, ...args);
                }
                return update.call(this, fields, ...args);
            }
        });
    }
});
