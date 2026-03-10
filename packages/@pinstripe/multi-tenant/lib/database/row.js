
import { Table, Row } from '@pinstripe/database';

Row.include({
    meta(){
        const { initialize, update } = this.prototype;

        this.include({
            initialize(database, fields, ...args){
                if(database.scopedByTenant){
                    if(this.constructor.untenantable){
                        if(database.tenant?.id && !fields?.tenantId){
                            return initialize.call(this, database, { ...fields, tenantId: database.tenant.id }, ...args);
                        }
                    } else {
                        return initialize.call(this, database, { ...fields, tenantId: database.tenant?.id }, ...args);
                    }
                }
                return initialize.call(this, database, fields, ...args);
            },

            update(fields, ...args){
                if(this.database.scopedByTenant){
                    if(this.constructor.untenantable){
                        if(this.database.tenant?.id && !fields?.tenantId){
                            return update.call(this, { ...fields, tenantId: this.database.tenant.id }, ...args);
                        }
                    } else {
                        return update.call(this, { ...fields, tenantId: this.database.tenant?.id }, ...args);
                    }
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
