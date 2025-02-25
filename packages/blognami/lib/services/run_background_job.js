
import { BackgroundJob } from '../background_job.js';

export default {
    create(){
        return (...args) => BackgroundJob.run(this.context, ...args);
    }
};
