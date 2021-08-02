
import chalk from 'chalk';
import { defineCommand } from 'pinstripe';

import { Controller } from '../controller.js';

defineCommand('list-controllers', () => {
    console.log('');
    console.log('The following controllers are available:');
    console.log('');
    Object.keys(Controller.classes).sort().forEach(controllerName => {
        console.log(`  * ${chalk.green(controllerName)}`);
    });
    console.log('');
});
