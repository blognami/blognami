
import { defer } from '../defer.js';

export default {
    meta(){
        this.addToClient();
    },
    
    create(){
        return defer;
    }
};
