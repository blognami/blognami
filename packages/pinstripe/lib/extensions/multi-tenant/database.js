
import { Database } from '../../database.js';

Database.include({
    get scopedByTenant(){
        return this.hasOwnProperty('tenant');
    }
});
