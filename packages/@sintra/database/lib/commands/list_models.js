
import chalk from 'chalk';
import { Row } from '@sintra/database';

export default {
    run(){
        console.log('');
        console.log('The following models are available:');
        console.log('');
        Row.names.forEach(modelName => {
            console.log(`  * ${chalk.green(modelName)}`);
        });
        console.log('');
    }
};
