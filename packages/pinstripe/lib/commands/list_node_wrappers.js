
import chalk from 'chalk';

export default ({ nodeWrapperNames }) => {
    console.log('');
    console.log('The following node wrappers are available:');
    console.log('');
    nodeWrapperNames.forEach(nodeWrapperName => {
        console.log(`  * ${chalk.green(nodeWrapperName)}`);
    });
    console.log('');
};
