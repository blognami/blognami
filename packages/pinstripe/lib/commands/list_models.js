
import chalk from 'chalk';

export default ({ modelNames }) => {
    console.log('');
    console.log('The following models are available:');
    console.log('');
    modelNames.forEach(modelName => {
        console.log(`  * ${chalk.green(modelName)}`);
    });
    console.log('');
};
