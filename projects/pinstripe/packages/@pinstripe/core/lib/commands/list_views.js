
import chalk from 'chalk';

import { Command } from '../command.js';
import { View } from '../view.js';

Command.register('list-views').define(dsl => dsl.props({
    run(){
        console.log('');
        console.log('The following views are available:');
        console.log('');
        Object.keys(View.classes).sort().forEach(viewName => {
            console.log(`  * ${chalk.green(viewName)}`);
        });
        console.log('');
    }
}));
