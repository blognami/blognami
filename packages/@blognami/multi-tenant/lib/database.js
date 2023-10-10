
import { Database } from 'blognami';

Database.include({
    get scopedByTenant(){
        return this.hasOwnProperty('tenant');
    }
});
