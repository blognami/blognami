
import chalk from 'chalk';

export default ({ commandNames }) => {
    console.log('');
    console.log('The following commands are available:');
    console.log('');
    commandNames.forEach(commandName => {
        console.log(`  * ${chalk.green(commandName)}`);
    });
    console.log('');
};
