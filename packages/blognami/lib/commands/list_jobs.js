
import { Job } from 'blognami';

export default {
    meta(){
        this.include(Job.createListCommand({ noun: 'jobs' }));
    }
};
