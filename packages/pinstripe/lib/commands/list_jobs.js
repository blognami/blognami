
import chalk from 'chalk';
import { Job } from 'pinstripe';

export default {
    meta(){
        this.assignProps({
            description: 'Lists all available jobs in the current project.'
        });
    },

    run(){
        console.log('');
        console.log('The following jobs are available:');
        console.log('');
        Job.names.forEach(jobName => {
            console.log(`  * ${chalk.green(jobName)}`);
        });
        console.log('');
    }
};
