
import { Migration } from '@pinstripe/database';

export default {
    meta(){
        this.include(Migration.createListCommand({ noun: 'migrations' }));
        this.tag('database');
    }
};
