
import { Row } from '@blognami/database';

export default {
    meta(){
        this.include(Row.createListCommand({ noun: 'models' }));
    }
};
