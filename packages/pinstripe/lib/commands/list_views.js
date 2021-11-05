
import chalk from 'chalk';

import { View } from '../view.js';

export default () => {
    console.log('');
    console.log('The following views are available:');
    console.log('');
    Object.keys(View.classes).sort().forEach(viewName => {
        console.log(`  * ${chalk.green(viewName)}`);
    });
    console.log('');
};
