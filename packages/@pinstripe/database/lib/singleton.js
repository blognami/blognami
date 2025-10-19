
import { Row } from './row.js';

Row.register('singleton', {
    meta(){
        this.addHook('validation', async function(){
            if(!this.isValidationError('general') && !this._exists && this.database[this.name]){
                this.setValidationError('general', `A singleton table can't contain more than one row`);
            }
        });
    }
});
