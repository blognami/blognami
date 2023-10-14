
import { Database } from 'pinstripe';

Database.include({
    get scopedByTenant(){
        return this.hasOwnProperty('tenant');
    }
});
