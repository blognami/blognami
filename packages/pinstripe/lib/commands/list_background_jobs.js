
import chalk from 'chalk';
import { BackgroundJob } from 'pinstripe';

export default {
    meta(){
        this.annotate({
            description: 'Lists all available background jobs in the current project.'
        });
    },

    run(){
        console.log('');
        console.log('The following background jobs are available:');
        console.log('');
        BackgroundJob.names.forEach(backgroundJobName => {
            console.log(`  * ${chalk.green(backgroundJobName)}`);
        });
        console.log('');
    }
};
