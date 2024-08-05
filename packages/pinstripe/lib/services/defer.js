
import { defer } from '../defer.js';

export const client = true;

export default {
    create(){
        return defer;
    }
};
