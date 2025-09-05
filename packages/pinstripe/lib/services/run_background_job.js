
import { BackgroundJob } from '../background_job.js';

export default {
    create(){
        return name => BackgroundJob.run(this.context, name);
    }
};
