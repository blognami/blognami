
import { BackgroundJob } from '../background_job.js';

export default {
    create(){
        return (name, params = {}) => BackgroundJob.run(name, params);
    }
};
