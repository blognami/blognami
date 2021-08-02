
import chalk from 'chalk';
import { defineCommand } from 'pinstripe';

import { ServiceFactory } from '../service_factory.js';

defineCommand('list-services', () => {
    console.log('');
    console.log('The following services are available:');
    console.log('');
    Object.keys(ServiceFactory.classes).sort().forEach(serviceName => {
        console.log(`  * ${chalk.green(serviceName)}`);
    });
    console.log('');
});

