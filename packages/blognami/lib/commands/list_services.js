
import chalk from 'chalk';
import { ServiceFactory } from 'blognami';

export default {
    run(){
        console.log('');
        console.log('The following views are available:');
        console.log('');
        ServiceFactory.names.forEach(serviceFactoryName => {
            console.log(`  * ${chalk.green(serviceFactoryName)}`);
        });
        console.log('');
    }
};
