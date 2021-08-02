
import chalk from 'chalk';
import { defineCommand } from 'pinstripe';

import { Row } from '../database/row.js';

defineCommand('list-models', () => {
    console.log('');
    console.log('The following models are available:');
    console.log('');
    Object.keys(Row.classes).sort().forEach(modelName => {
        console.log(`  * ${chalk.green(modelName)}`);
    });
    console.log('');
});
