
import { Job } from '../job.js';

export default {
    create(){
        const { context, initialParams } = this;
        return (name, params = {}) => Job.run(name, { ...initialParams, ...params }, context);
    }
};
