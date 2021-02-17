
import chalk from 'chalk';

import { Command } from '../command.js';
import { Controller } from '../controller.js';

Command.register('list-controllers').define(dsl => dsl.props({
    run(){
        console.log('');
        console.log('The following controllers are available:');
        console.log('');
        Object.keys(Controller.classes).sort().forEach(controllerName => {
            console.log(`  * ${chalk.green(controllerName)}`);
        });
        console.log('');
    }
}));
