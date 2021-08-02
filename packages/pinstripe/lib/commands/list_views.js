
import chalk from 'chalk';
import { defineCommand } from 'pinstripe';

import { View } from '../view.js';

defineCommand('list-views', () => {
    console.log('');
    console.log('The following views are available:');
    console.log('');
    Object.keys(View.classes).sort().forEach(viewName => {
        console.log(`  * ${chalk.green(viewName)}`);
    });
    console.log('');
});
