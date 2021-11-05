
import chalk from 'chalk';

import { Row } from '../database/row.js';

export default () => {
    console.log('');
    console.log('The following models are available:');
    console.log('');
    Object.keys(Row.classes).sort().forEach(modelName => {
        console.log(`  * ${chalk.green(modelName)}`);
    });
    console.log('');
};
