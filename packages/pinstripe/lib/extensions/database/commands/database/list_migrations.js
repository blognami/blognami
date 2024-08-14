
import chalk from 'chalk';
import { Migration } from 'pinstripe/database';

export default {
    run(){
        console.log('');
        console.log('The following migrations are available:');
        console.log('');
        Migration.names.forEach(migrationName => {
            console.log(`  * ${chalk.green(migrationName)}`);
        });
        console.log('');
    }
};
