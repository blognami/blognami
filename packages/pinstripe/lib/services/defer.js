
import { defer } from '../defer.js';

const client = {
    create(){
        return defer;
    }
};

export default client;
