
import chalk from 'chalk';
import { defineCommand } from 'pinstripe';

import { Migration } from '../database/migration.js'

defineCommand('list-migrations', () => {
    console.log('');
    console.log('The following migrations are available:');
    console.log('');
    Object.keys(Migration.classes).sort().forEach(migrationName => {
        console.log(`  * ${chalk.green(migrationName)}`);
    });
    console.log('');
});
