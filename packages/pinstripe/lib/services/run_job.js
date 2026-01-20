
import { Job } from '../job.js';

export default {
    create(){
        return (name, params = {}) => Job.run(name, params);
    }
};
