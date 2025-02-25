
import chalk from 'chalk';
import { BackgroundJob } from 'blognami';

export default {
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
