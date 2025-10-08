
import chalk from 'chalk';
import { Migration } from '@pinstripe/database';

export default {
    meta(){
        this.annotate({
            description: 'Lists all available database migrations in the project.'
        });
    },

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
