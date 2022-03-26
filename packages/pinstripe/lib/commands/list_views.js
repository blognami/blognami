
import chalk from 'chalk';

export default ({ viewNames }) => {
    console.log('');
    console.log('The following views are available:');
    console.log('');
    viewNames.forEach(viewName => {
        console.log(`  * ${chalk.green(viewName)}`);
    });
    console.log('');
};
