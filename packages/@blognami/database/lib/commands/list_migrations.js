
import { Migration } from '@blognami/database';

export default {
    meta(){
        this.include(Migration.createListCommand({ noun: 'migrations' }));
    }
};
