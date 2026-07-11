
import { Job } from 'pinstripe';

export default {
    meta(){
        this.include(Job.createListCommand({ noun: 'jobs' }));
    }
};
