
import { Row } from '@pinstripe/database';

export default {
    meta(){
        this.include(Row.createListCommand({ noun: 'models' }));
        this.tag('database');
    }
};
