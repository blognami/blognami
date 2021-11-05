
import { Database } from '../database.js';

export default {
    meta(){
        this.scope = 'root';
    },

    create(){
        return Database.new(this.environment);
    }
};
