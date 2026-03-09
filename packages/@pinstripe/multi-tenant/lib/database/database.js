
import { Database, Row } from '@pinstripe/database';

Database.include({
    meta(){
        const { singleton } = this.prototype;

        this.include({
            singleton(name){
                const { untenantable } = Row.for(name);
                if(untenantable || this.tenant) return singleton.call(this, name);
            }
        });
    },

    get scopedByTenant(){
        return this.hasOwnProperty('tenant');
    }
});
