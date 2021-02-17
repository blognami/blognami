
import chalk from 'chalk';

import { Command } from '../command.js';
import { Migration } from '../database/migration.js';

Command.register('list-migrations').define(dsl => dsl.props({
    run(){
        console.log('');
        console.log('The following migrations are available:');
        console.log('');
        Object.keys(Migration.classes).sort().forEach(migrationName => {
            console.log(`  * ${chalk.green(migrationName)}`);
        });
        console.log('');
    }
}));
