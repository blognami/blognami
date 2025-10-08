
import chalk from 'chalk';
import { ServiceFactory } from 'pinstripe';

export default {
    meta(){
        this.annotate({
            description: 'Lists all available services in the current project.'
        });
    },

    run(){
        console.log('');
        console.log('The following services are available:');
        console.log('');
        ServiceFactory.names.forEach(serviceFactoryName => {
            console.log(`  * ${chalk.green(serviceFactoryName)}`);
        });
        console.log('');
    }
};
