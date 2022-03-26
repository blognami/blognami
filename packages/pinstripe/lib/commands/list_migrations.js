
import chalk from 'chalk';

export default ({ migrationNames }) => {
    console.log('');
    console.log('The following migrations are available:');
    console.log('');
    migrationNames.forEach(migrationName => {
        console.log(`  * ${chalk.green(migrationName)}`);
    });
    console.log('');
};
