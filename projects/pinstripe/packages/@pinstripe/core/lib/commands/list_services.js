
import chalk from 'chalk';

import { Command } from '../command.js';
import { ServiceFactory } from '../service_factory.js';

Command.register('list-services').define(dsl => dsl.props({
    run(){
        console.log('');
        console.log('The following services are available:');
        console.log('');
        Object.keys(ServiceFactory.classes).sort().forEach(serviceFactoryName => {
            console.log(`  * ${chalk.green(serviceFactoryName)}`);
        });
        console.log('');
    }
}));
