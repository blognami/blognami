
import chalk from 'chalk';

import { Decorator } from '../decorator.js';

export default () => {
    console.log('');
    console.log('The following decorators are available:');
    console.log('');
    Object.keys(Decorator.classes).sort().forEach(decoratorName => {
        console.log(`  * ${chalk.green(decoratorName)}`);
    });
    console.log('');
};
