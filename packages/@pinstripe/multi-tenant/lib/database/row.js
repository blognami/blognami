
import { Table, Row } from '@pinstripe/database';

Row.include({
    meta(){
        const { initialize, update } = this.prototype;

        this.include({
            initialize(database, fields, ...args){
                if(!this.constructor.untenantable && database.scopedByTenant){
                    return initialize.call(this, database, { ...fields, tenantId: database.tenant?.id }, ...args);
                }
                return initialize.call(this, database, fields, ...args);
            },

            update(fields, ...args){
                const columns = Table.for(this.constructor.collectionName).columns;
                if(!this.constructor.untenantable && this.database.scopedByTenant){
                    return update.call(this, { ...fields, tenantId: this.database.tenant?.id }, ...args);
                }
                return update.call(this, fields, ...args);
            }
        });

        this.mustNotBeBlank('tenantId', {
            when(){
                return !this.constructor.untenantable;
            }
        })
    }
});
