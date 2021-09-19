
import { defineService } from 'pinstripe';

import { Database } from '../database.js';

defineService('database', {
    meta(){
        this.scope = 'root';
    },

    create(){
        return Database.new(this.environment);
    }
});

