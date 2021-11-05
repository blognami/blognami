
import chalk from 'chalk';

import { Migration } from '../database/migration.js'

export default () => {
    console.log('');
    console.log('The following migrations are available:');
    console.log('');
    Object.keys(Migration.classes).sort().forEach(migrationName => {
        console.log(`  * ${chalk.green(migrationName)}`);
    });
    console.log('');
};
