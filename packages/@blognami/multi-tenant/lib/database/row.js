
import { Table, Row } from 'blognami/database';

Row.include({
    meta(){
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
