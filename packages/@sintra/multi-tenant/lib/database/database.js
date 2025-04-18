
import { Database } from '@sintra/database';

Database.include({
    meta(){
        const { singleton } = this.prototype;

        this.include({
            singleton(...args){
                if(this.tenant) return singleton.call(this, ...args);
            }
        });
    },

    get scopedByTenant(){
        return this.hasOwnProperty('tenant');
    }
});
