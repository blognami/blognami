
import chalk from 'chalk';
import { ServiceFactory } from 'sartor';

export default {
    meta(){
        this.assignProps({
            description: 'Lists the registered services.'
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
