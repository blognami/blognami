
import chalk from 'chalk';

export default ({ serviceNames }) => {
    console.log('');
    console.log('The following services are available:');
    console.log('');
    serviceNames.forEach(serviceName => {
        console.log(`  * ${chalk.green(serviceName)}`);
    });
    console.log('');
};

